# ClearCase: AWS Cedar Fine-Grained Authorization Specification

This document details the fine-grained authorization architecture, AWS Cedar policies, entity schemas, and principal evaluation context implemented for **Project ClearCase** (Offline-First, Voice-Native AI Dispute Resolution Mesh for Bharat).

---

## 1. Overview & Security Model

ClearCase deals with sensitive rural disputes (land boundary disputes, unpaid wages, right-of-way easements). To protect citizen privacy, prevent unauthorized snooping, and ensure that informal mediators (Panchayat Pradhans, Nyaya Mitras) only adjudicate within their designated administrative jurisdiction, access is governed by **AWS Cedar policies**.

The authorization engine inspects every incoming HTTP request and evaluates three non-negotiable security boundaries:
1. **Citizen Isolation**: Citizens can only view or act on cases in which they are explicitly registered as a disputant party.
2. **Mediator Jurisdiction Isolation**: Mediators can only review, edit, or escalate disputes that fall within their designated district/block. Cross-district tampering is strictly forbidden.
3. **Mediator Queue Guard**: Only principals holding the `MEDIATOR` role can list or query the pending mediator dispute queues.

---

## 2. Cedar Policies (`policies/clearcase.cedar`)

```cedar
// ==============================================================================
// Project ClearCase: AWS Cedar Authorization Policies
// Namespace: ClearCase
// ==============================================================================

// ------------------------------------------------------------------------------
// Rule 1: Citizen Isolation
// Citizens can only read, update, or submit consent for cases where their
// principal ID (e.g. phone number) is listed as an active disputing party.
// ------------------------------------------------------------------------------
permit (
    principal in ClearCase::Role::"Citizen",
    action in [
        ClearCase::Action::"ReadCase",
        ClearCase::Action::"UpdateCase",
        ClearCase::Action::"ConfirmConsent",
        ClearCase::Action::"EscalateCase",
        ClearCase::Action::"ReadAuditTrail"
    ],
    resource is ClearCase::Case
)
when {
    resource.parties.contains(principal.id)
};

// ------------------------------------------------------------------------------
// Rule 2: Mediator Jurisdiction Isolation
// Mediators can only read, review, or escalate cases within their assigned
// administrative district / jurisdiction. Cross-district tampering is forbidden.
// ------------------------------------------------------------------------------
permit (
    principal in ClearCase::Role::"Mediator",
    action in [
        ClearCase::Action::"ReadCase",
        ClearCase::Action::"UpdateCase",
        ClearCase::Action::"ReviewCase",
        ClearCase::Action::"EscalateCase",
        ClearCase::Action::"ReadAuditTrail"
    ],
    resource is ClearCase::Case
)
when {
    principal.jurisdiction == resource.jurisdiction
};

// ------------------------------------------------------------------------------
// Rule 3: Mediator Queue Guard
// Only principals with role "Mediator" can access the Mediator Review Queue
// on the MediatorDashboard application resource.
// ------------------------------------------------------------------------------
permit (
    principal in ClearCase::Role::"Mediator",
    action == ClearCase::Action::"ListMediatorQueue",
    resource == ClearCase::Application::"MediatorDashboard"
)
when {
    principal.jurisdiction != ""
};
```

---

## 3. Principal Identity & Header Context

Authentication identity is extracted from standard request headers by `src/authz/cedarService.ts`:

| Header | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `x-user-id` | String | `+919876543210` or `mediator-vns-1` | Unique principal identifier (phone number for citizens, user ID for mediators) |
| `x-user-role` | String | `CITIZEN` or `MEDIATOR` | Role of the calling principal (defaults to `CITIZEN`) |
| `x-user-jurisdiction`| String | `Varanasi` or `Sonipat` | Required for mediators to define their authorized administrative boundary |

---

## 4. Policy Decision Matrix

| Role | Target Resource | Action | Condition | Result |
| :--- | :--- | :--- | :--- | :--- |
| `CITIZEN` | `Case#<id>` | `ReadCase` | Phone listed in case parties | **PERMIT** |
| `CITIZEN` | `Case#<id>` | `ReadCase` | Phone NOT listed in case parties | **DENY (403)** |
| `CITIZEN` | `Case#<id>` | `ConfirmConsent` | Phone listed in case parties | **PERMIT** |
| `CITIZEN` | `MediatorDashboard` | `ListMediatorQueue` | Any | **DENY (403)** |
| `MEDIATOR` | `MediatorDashboard` | `ListMediatorQueue` | Valid `jurisdiction` present | **PERMIT** |
| `MEDIATOR` | `Case#<id>` | `ReviewCase` | `principal.jurisdiction == case.district` | **PERMIT** |
| `MEDIATOR` | `Case#<id>` | `ReviewCase` | `principal.jurisdiction != case.district` | **DENY (403)** |

---

## 5. Live Execution Trace (Demo Verification)

```bash
# Permitted: Citizen accessing own case
[Cedar AuthZ] Evaluating Request -> Principal: +919876543210 (CITIZEN) | Action: ReadCase | Resource: Case#case-001
[Cedar AuthZ] Decision: PERMIT -> Rule 1 matched. Citizen +919876543210 is an active disputing party.

# Denied: Intruder citizen attempting to view dispute
[Cedar AuthZ] Evaluating Request -> Principal: +919999999999 (CITIZEN) | Action: ReadCase | Resource: Case#case-001
[Cedar AuthZ] Decision: DENY -> Access Denied: Citizen "+919999999999" is not an authorized party in Case "case-001".

# Denied: Cross-district mediator tampering attempt
[Cedar AuthZ] Evaluating Request -> Principal: mediator-snp-1 (MEDIATOR) | Action: ReviewCase | Resource: Case#case-001
[Cedar AuthZ] Decision: DENY -> Access Denied: Mediator jurisdiction "Sonipat" does not match Case jurisdiction "Varanasi". Cross-district mediation forbidden.
```
