import { CedarAction, CedarPrincipal, CedarResource } from '../types';

/**
 * AWS Cedar Policy Authorization Service
 * Evaluates access control against Cedar policies defined in `policies/clearcase.cedar`.
 */

/**
 * Extract caller's principal identity from request headers.
 * Header lookup is case-insensitive.
 */
export function extractPrincipal(headers?: Record<string, string | undefined>): CedarPrincipal {
  if (!headers) {
    return { id: 'anonymous', role: 'CITIZEN' };
  }

  // Normalize header keys to lowercase
  const normalized: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(headers)) {
    normalized[key.toLowerCase()] = value;
  }

  const userId = normalized['x-user-id'] || 'anonymous';
  const rawRole = (normalized['x-user-role'] || '').toUpperCase();
  const role: 'CITIZEN' | 'MEDIATOR' = rawRole === 'MEDIATOR' ? 'MEDIATOR' : 'CITIZEN';
  const jurisdiction = normalized['x-user-jurisdiction']?.trim();

  return {
    id: userId.trim(),
    role,
    jurisdiction: jurisdiction || undefined,
  };
}

/**
 * Evaluate authorization request against Cedar policies:
 *  - Rule 1 (Citizen Isolation): resource.parties.contains(principal.id)
 *  - Rule 2 (Mediator Jurisdiction Isolation): principal.jurisdiction == resource.jurisdiction
 *  - Rule 3 (Mediator Queue Guard): principal.role == "Mediator" on MediatorDashboard
 */
export async function isAuthorized(
  principal: CedarPrincipal,
  action: CedarAction,
  resource: CedarResource,
  context: Record<string, any> = {}
): Promise<{ authorized: boolean; reason?: string }> {
  console.log(
    `[Cedar AuthZ] Evaluating Request -> Principal: ${principal.id} (${principal.role}) | Action: ${action} | Resource: ${resource.type}#${resource.id}`
  );

  // ---------------------------------------------------------------------------
  // Rule 3: Mediator Queue Guard
  // ---------------------------------------------------------------------------
  if (action === 'ListMediatorQueue' && resource.type === 'MediatorDashboard') {
    if (principal.role !== 'MEDIATOR') {
      const reason = `Access Denied: Principal role "${principal.role}" cannot access Mediator Queue. Role "MEDIATOR" required.`;
      console.warn(`[Cedar AuthZ] Decision: DENY -> ${reason}`);
      return { authorized: false, reason };
    }

    if (!principal.jurisdiction) {
      const reason = `Access Denied: Mediator "${principal.id}" has no assigned jurisdiction.`;
      console.warn(`[Cedar AuthZ] Decision: DENY -> ${reason}`);
      return { authorized: false, reason };
    }

    console.log(`[Cedar AuthZ] Decision: PERMIT -> Rule 3 matched for Mediator in jurisdiction: ${principal.jurisdiction}`);
    return { authorized: true };
  }

  // ---------------------------------------------------------------------------
  // Rule 1: Citizen Isolation
  // ---------------------------------------------------------------------------
  if (principal.role === 'CITIZEN' && resource.type === 'Case') {
    const allowedCitizenActions: CedarAction[] = [
      'ReadCase',
      'UpdateCase',
      'ConfirmConsent',
      'EscalateCase',
      'ReadAuditTrail',
    ];

    if (!allowedCitizenActions.includes(action)) {
      const reason = `Access Denied: Action "${action}" not permitted for role "CITIZEN".`;
      console.warn(`[Cedar AuthZ] Decision: DENY -> ${reason}`);
      return { authorized: false, reason };
    }

    // Check if principal.id is in resource.parties
    const cleanPrincipalId = (principal.id || '').replace(/[^0-9+]/g, '');
    const cleanParties = (resource.parties || [])
      .filter((p): p is string => Boolean(p && typeof p === 'string'))
      .map((p) => p.replace(/[^0-9+]/g, ''));

    const isParty =
      (cleanPrincipalId && cleanParties.includes(cleanPrincipalId)) ||
      (resource.parties || []).includes(principal.id);

    if (isParty) {
      console.log(`[Cedar AuthZ] Decision: PERMIT -> Rule 1 matched. Citizen ${principal.id} is an active disputing party.`);
      return { authorized: true };
    } else {
      const reason = `Access Denied: Citizen "${principal.id}" is not an authorized party in Case "${resource.id}".`;
      console.warn(`[Cedar AuthZ] Decision: DENY -> ${reason}`);
      return { authorized: false, reason };
    }
  }

  // ---------------------------------------------------------------------------
  // Rule 2: Mediator Jurisdiction Isolation
  // ---------------------------------------------------------------------------
  if (principal.role === 'MEDIATOR' && resource.type === 'Case') {
    const allowedMediatorActions: CedarAction[] = [
      'ReadCase',
      'UpdateCase',
      'ReviewCase',
      'EscalateCase',
      'ReadAuditTrail',
    ];

    if (!allowedMediatorActions.includes(action)) {
      const reason = `Access Denied: Action "${action}" not permitted for role "MEDIATOR".`;
      console.warn(`[Cedar AuthZ] Decision: DENY -> ${reason}`);
      return { authorized: false, reason };
    }

    if (!principal.jurisdiction || !resource.jurisdiction) {
      const reason = `Access Denied: Missing jurisdiction on Mediator or Case.`;
      console.warn(`[Cedar AuthZ] Decision: DENY -> ${reason}`);
      return { authorized: false, reason };
    }

    const matchesJurisdiction =
      principal.jurisdiction.trim().toLowerCase() === resource.jurisdiction.trim().toLowerCase();

    if (matchesJurisdiction) {
      console.log(
        `[Cedar AuthZ] Decision: PERMIT -> Rule 2 matched. Mediator jurisdiction "${principal.jurisdiction}" matches Case jurisdiction.`
      );
      return { authorized: true };
    } else {
      const reason = `Access Denied: Mediator jurisdiction "${principal.jurisdiction}" does not match Case jurisdiction "${resource.jurisdiction}". Cross-district mediation forbidden.`;
      console.warn(`[Cedar AuthZ] Decision: DENY -> ${reason}`);
      return { authorized: false, reason };
    }
  }

  // Default Deny
  const defaultReason = `Access Denied: No matching Cedar permit policy for Principal=${principal.id}, Action=${action}, Resource=${resource.type}`;
  console.warn(`[Cedar AuthZ] Decision: DENY -> ${defaultReason}`);
  return { authorized: false, reason: defaultReason };
}
