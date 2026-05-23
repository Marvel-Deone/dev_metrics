export function invitationTemplate(
  workspaceName: string,
  invitedBy: string,
  acceptUrl: string,
) {
  return `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 24px;
      "
    >
      <h2>Join ${workspaceName} on DevMetrics</h2>

      <p>
        <strong>${invitedBy}</strong>
        invited you to collaborate on DevMetrics.
      </p>

      <p>
        Accept the invitation below:
      </p>

      <a
        href="${acceptUrl}"
        style="
          display:inline-block;
          background:#111827;
          color:white;
          padding:12px 20px;
          border-radius:8px;
          text-decoration:none;
        "
      >
        Accept Invitation
      </a>

      <p style="margin-top:24px;">
        This invitation expires in 7 days.
      </p>
    </div>
  `;
}