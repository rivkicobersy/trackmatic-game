export function exportLeaderboardToCSV(data: any[]) {
  const headers = ["Name", "Company", "Score", "Level", "Email"];

  const clean = (value: any) =>
    String(value)
      .replace(/"/g, '""')
      .replace(/\r?\n|\r/g, " ");

  const rows = data.map((player) => [
    player.name,
    player.company,
    player.score,
    player.level,
    player.email,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${clean(cell)}"`).join(";")) // Use semicolon
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "leaderboard.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
