import { toast } from "sonner";

/**
 * Optional destination for lead forms (e.g. a GHL/CRM webhook). Configured via
 * `NEXT_PUBLIC_FORM_ENDPOINT`. When empty we still validate and confirm to the user,
 * but nothing is sent — useful for previews before the CRM is wired up.
 */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export async function submitLeadForm(
  formName: string,
  payload: Record<string, string>,
): Promise<boolean> {
  try {
    if (FORM_ENDPOINT) {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: formName, ...payload }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed (${response.status})`);
      }
    }

    toast.success("Thanks! We'll be in touch shortly.");
    return true;
  } catch (error) {
    console.error("Form submission failed", error);
    toast.error("Something went wrong. Please try again or email us directly.");
    return false;
  }
}
