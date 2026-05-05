const tagName = "sarcoma-fasttrack-app";

function normalizeApiBase(value) {
  return (value || "http://localhost:8000").replace(/\/+$/, "");
}

class SarcomaFasttrackCv2App extends HTMLElement {
  static observedAttributes = ["api-base"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render("Connecting to backend...");
    this.loadMessage();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.loadMessage();
    }
  }

  get apiBase() {
    return normalizeApiBase(this.getAttribute("api-base"));
  }

  async loadMessage() {
    try {
      const response = await fetch(`${this.apiBase}/api/message`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      this.render(data.message, data.service, data.time);
    } catch (error) {
      this.render(`Backend not reachable: ${error.message}`);
    }
  }

  render(message, service = "waiting", time = "") {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          font: 16px/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #14213d;
        }
        .panel {
          max-width: 760px;
          margin: 32px auto;
          padding: 24px;
          border: 1px solid #d7dde8;
          border-radius: 8px;
          background: #ffffff;
          box-shadow: 0 8px 28px rgba(20, 33, 61, 0.08);
        }
        h1 {
          margin: 0 0 12px;
          font-size: 24px;
          line-height: 1.2;
        }
        dl {
          display: grid;
          grid-template-columns: max-content 1fr;
          gap: 8px 16px;
          margin: 16px 0 0;
        }
        dt {
          font-weight: 700;
        }
        dd {
          margin: 0;
          overflow-wrap: anywhere;
        }
      </style>
      <section class="panel">
        <h1>Sarcoma FastTrack</h1>
        <p>${escapeHtml(message)}</p>
        <dl>
          <dt>API base</dt>
          <dd>${escapeHtml(this.apiBase)}</dd>
          <dt>Service</dt>
          <dd>${escapeHtml(service)}</dd>
          <dt>Time</dt>
          <dd>${escapeHtml(time || "-")}</dd>
        </dl>
      </section>
    `;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

if (!customElements.get(tagName)) {
  customElements.define(tagName, SarcomaFasttrackCv2App);
}

export { normalizeApiBase };
