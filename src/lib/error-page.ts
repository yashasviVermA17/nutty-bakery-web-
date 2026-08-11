export function renderErrorPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Something went wrong — Nutty Delight Bakery</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: "DM Sans", "Inter", ui-sans-serif, system-ui, sans-serif;
        background: #fbf3e7;
        color: #3a2517;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }
      .card {
        text-align: center;
        max-width: 480px;
        padding: 3rem 2rem;
        border-radius: 1.5rem;
        background: #fffdf8;
        border: 1px solid rgb(201 162 75 / 0.25);
        box-shadow: 0 24px 60px -28px rgb(107 63 35 / 0.35);
      }
      .stamp {
        display: inline-block;
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        font-weight: 700;
        color: #a97b22;
        border: 1px solid rgb(201 162 75 / 0.5);
        border-radius: 999px;
        padding: 0.35rem 0.9rem;
        margin-bottom: 1.5rem;
      }
      h1 {
        font-family: "Playfair Display", Georgia, serif;
        font-size: 1.75rem;
        margin-bottom: 0.75rem;
      }
      p {
        font-size: 0.95rem;
        line-height: 1.6;
        color: #6b5d4e;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="stamp">Nutty Delight Bakery</span>
      <h1>Something went wrong</h1>
      <p>
        We hit a snag in the kitchen. Please try again in a moment — our bakers are on it.
      </p>
    </div>
  </body>
</html>`;
}
