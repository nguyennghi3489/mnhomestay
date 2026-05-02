// Settings.jsx — simple stub showcasing the brand voice
const { SectionHead, Field } = window.HearthPrimitives;

function Settings() {
  return (
    <div>
      <SectionHead eyebrow="Account" title="Settings" />
      <div className="card-flat" style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0, marginBottom: 14, fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 20 }}>Your property</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Property name"><input defaultValue="Fern House" /></Field>
          <Field label="Town"><input defaultValue="Coorg, Karnataka" /></Field>
          <Field label="Check-in time"><input defaultValue="2:00 PM" /></Field>
          <Field label="Check-out time"><input defaultValue="11:00 AM" /></Field>
        </div>
      </div>
      <div className="card-flat">
        <h3 style={{ margin: 0, marginBottom: 6, fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 20 }}>Welcome note</h3>
        <p style={{ margin: 0, marginBottom: 12, fontSize: 13.5, color: "var(--fg-2)" }}>Sent to every guest two days before arrival.</p>
        <Field>
          <textarea rows="5" defaultValue={"Hello, and welcome to Fern House.\n\nWe'll have your room ready by two. There's chai on the verandah and a key under the lantern.\n\nSee you soon."}></textarea>
        </Field>
      </div>
    </div>
  );
}

window.Settings = Settings;
