const users = [
  { id: 1, name: "Ada Lovelace", role: "Admin" },
  { id: 2, name: "Grace Hopper", role: "Editor" },
  { id: 3, name: "Linus Torvalds", role: "Viewer" },
];

export async function GET() {
  return Response.json({ users });
}
