// Deliberately unavailable until an approved CRM and privacy policy are provided.
// Never return success without a confirmed durable delivery receipt.
export async function deliverLead(): Promise<never> {
  throw new Error("CRM_NOT_CONFIGURED");
}
