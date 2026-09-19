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
    // Principal must specify a valid administrative jurisdiction
    principal.jurisdiction != ""
};
