// Turso HTTP API - Prisma o'rniga
const TURSO_URL = process.env.TURSO_DATABASE_URL?.replace("libsql://", "https://");
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

async function tursoQuery(sql: string, args: any[] = []) {
  const res = await fetch(`${TURSO_URL}/v2/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TURSO_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        { type: "execute", stmt: { sql, args: args.map(v => ({ type: typeof v === "number" ? "integer" : "text", value: String(v ?? "") })) } },
        { type: "close" },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Turso error: ${res.status} - ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const result = data.results?.[0]?.response?.result;
  
  if (!result) return [];

  const cols = result.cols.map((c: any) => c.name);
  return result.rows.map((row: any[]) => {
    const obj: any = {};
    cols.forEach((col: string, i: number) => {
      obj[col] = row[i]?.value ?? null;
    });
    return obj;
  });
}

async function tursoExec(sql: string, args: any[] = []) {
  return tursoQuery(sql, args);
}

// Initialize tables
export async function initDB() {
  await tursoExec(`CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    plan TEXT DEFAULT 'free',
    credits INTEGER DEFAULT -1,
    createdAt TEXT DEFAULT (datetime('now'))
  )`);

  await tursoExec(`CREATE TABLE IF NOT EXISTS GeneratedImage (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    prompt TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    model TEXT DEFAULT 'flux-schnell',
    style TEXT DEFAULT 'none',
    createdAt TEXT DEFAULT (datetime('now'))
  )`);
}

// User operations
export const db = {
  user: {
    async findUnique({ where }: { where: { email?: string; id?: string } }) {
      let rows;
      if (where.email) {
        rows = await tursoQuery("SELECT * FROM User WHERE email = ? LIMIT 1", [where.email]);
      } else if (where.id) {
        rows = await tursoQuery("SELECT * FROM User WHERE id = ? LIMIT 1", [where.id]);
      }
      const user = rows?.[0];
      if (user) user.credits = parseInt(user.credits);
      return user || null;
    },

    async create({ data }: { data: any }) {
      const id = crypto.randomUUID();
      await tursoExec(
        "INSERT INTO User (id, name, email, password, plan, credits) VALUES (?, ?, ?, ?, ?, ?)",
        [id, data.name || "", data.email, data.password || "", data.plan || "free", data.credits ?? -1]
      );
      return { id, ...data };
    },

    async update({ where, data }: { where: { id: string }; data: any }) {
      if (data.credits !== undefined) {
        await tursoExec("UPDATE User SET credits = ? WHERE id = ?", [data.credits, where.id]);
      }
      if (data.plan !== undefined) {
        await tursoExec("UPDATE User SET plan = ? WHERE id = ?", [data.plan, where.id]);
      }
      return db.user.findUnique({ where });
    },
  },

  generatedImage: {
    async create({ data }: { data: any }) {
      const id = crypto.randomUUID();
      await tursoExec(
        "INSERT INTO GeneratedImage (id, userId, prompt, imageUrl, model, style) VALUES (?, ?, ?, ?, ?, ?)",
        [id, data.userId, data.prompt, data.imageUrl, data.model || "flux-schnell", data.style || "none"]
      );
      return { id, ...data };
    },

    async findMany({ where, orderBy, skip = 0, take = 12 }: any) {
      const rows = await tursoQuery(
        "SELECT * FROM GeneratedImage WHERE userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?",
        [where.userId, take, skip]
      );
      return rows;
    },

    async count({ where }: { where: { userId: string } }) {
      const rows = await tursoQuery(
        "SELECT COUNT(*) as count FROM GeneratedImage WHERE userId = ?",
        [where.userId]
      );
      return parseInt(rows[0]?.count || "0");
    },
  },
};
