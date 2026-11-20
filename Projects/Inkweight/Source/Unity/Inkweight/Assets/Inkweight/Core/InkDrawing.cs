// Drawing grid, body extraction and stats. Port of core/drawing.js.
// A drawing is a flat array of W*H integers, index = y * W + x.
// 0 empty, 1 Black, 2 Ember (red), 3 Tide (blue), 4 Moss (green).
using System;

namespace Inkweight.Core
{
    // Small plain pair of doubles (the core never uses engine vector types).
    public struct InkVec2
    {
        public double X, Y;
        public InkVec2(double x, double y) { X = x; Y = y; }
    }

    public sealed class InkBodyExtract
    {
        public int[] Body; // colour of body cells, 0 elsewhere
        public int N, Filled, Drips;
    }

    public sealed class InkStats
    {
        public string Kind; // "figure" or "weapon"
        public double Budget;
        public int Filled, Drips, N, C, S;
        public int Enclosed, P;            // enclosed empty cells, pocket cells
        public double PocketCells, Push;   // pocket cells that count, push weight
        public int[] ColourCounts; // black, ember, tide, moss
        public int Element;        // 0 neutral or 2/3/4
        public bool BigEnough, WithinBudget, Valid;
        public double Weight, Armour, Sharpness, TopSpeed, Cx, Cy, Radius, Inertia;
    }

    public static class InkDrawing
    {
        public const int ElementNeutral = 0;
        public const int ColourBlack = 1;
        public const int ColourEmber = 2;
        public const int ColourTide = 3;
        public const int ColourMoss = 4;

        public const string KindFigure = "figure";
        public const string KindWeapon = "weapon";

        // rows: H strings of W characters, '.' empty, '1'..'4' colours.
        public static int[] Parse(string[] rows, out int W, out int H)
        {
            H = rows.Length;
            W = rows[0].Length;
            int[] cells = new int[W * H];
            for (int y = 0; y < H; y++)
            {
                string row = rows[y];
                if (row.Length != W) throw new ArgumentException("row " + y + " has wrong length");
                for (int x = 0; x < W; x++)
                {
                    int ch = row[x];
                    int v = 0;
                    if (ch >= 49 && ch <= 52) v = ch - 48;
                    else if (ch != 46) throw new ArgumentException("bad character in row " + y);
                    cells[y * W + x] = v;
                }
            }
            return cells;
        }

        public static string[] ToRows(int[] cells, int W, int H)
        {
            string[] rows = new string[H];
            char[] buf = new char[W];
            for (int y = 0; y < H; y++)
            {
                for (int x = 0; x < W; x++)
                {
                    int v = cells[y * W + x];
                    buf[x] = v == 0 ? '.' : (char)(48 + v);
                }
                rows[y] = new string(buf);
            }
            return rows;
        }

        public static int[] Empty(int W, int H)
        {
            return new int[W * H];
        }

        // Largest 4-connected group. Groups are found by scanning cell indices
        // upward; a later group only replaces the best one when it is strictly
        // larger (rule 2.1 tie-break).
        public static InkBodyExtract ExtractBody(int[] cells, int W, int H)
        {
            int total = W * H;
            int[] label = new int[total];
            for (int i = 0; i < total; i++) label[i] = -1;
            int[] stack = new int[total];
            int filled = 0;
            int bestLabel = -1;
            int bestSize = 0;
            int nextLabel = 0;
            for (int i = 0; i < total; i++)
            {
                if (cells[i] == 0) continue;
                filled++;
                if (label[i] != -1) continue;
                int sp = 0;
                int size = 0;
                stack[sp++] = i;
                label[i] = nextLabel;
                while (sp > 0)
                {
                    int k = stack[--sp];
                    size++;
                    int x = k % W;
                    int y = (k - x) / W;
                    if (x > 0 && cells[k - 1] != 0 && label[k - 1] == -1) { label[k - 1] = nextLabel; stack[sp++] = k - 1; }
                    if (x < W - 1 && cells[k + 1] != 0 && label[k + 1] == -1) { label[k + 1] = nextLabel; stack[sp++] = k + 1; }
                    if (y > 0 && cells[k - W] != 0 && label[k - W] == -1) { label[k - W] = nextLabel; stack[sp++] = k - W; }
                    if (y < H - 1 && cells[k + W] != 0 && label[k + W] == -1) { label[k + W] = nextLabel; stack[sp++] = k + W; }
                }
                if (size > bestSize) { bestSize = size; bestLabel = nextLabel; }
                nextLabel++;
            }
            InkBodyExtract ex = new InkBodyExtract();
            ex.Body = new int[total];
            for (int i = 0; i < total; i++) ex.Body[i] = (bestLabel != -1 && label[i] == bestLabel) ? cells[i] : 0;
            ex.N = bestSize;
            ex.Filled = filled;
            ex.Drips = filled - bestSize;
            return ex;
        }

        // Number of the 8 neighbours of (x, y) that are body cells. Outside = empty.
        public static int CountNeighbours(int[] body, int W, int H, int x, int y)
        {
            int n = 0;
            for (int oy = -1; oy <= 1; oy++)
            {
                int yy = y + oy;
                if (yy < 0 || yy >= H) continue;
                for (int ox = -1; ox <= 1; ox++)
                {
                    if (ox == 0 && oy == 0) continue;
                    int xx = x + ox;
                    if (xx < 0 || xx >= W) continue;
                    if (body[yy * W + xx] != 0) n++;
                }
            }
            return n;
        }

        // Sharp cell test (rules version 2): a body cell is sharp when it is
        // not part of any completely filled 2 x 2 square of body cells.
        public static bool IsSharpCell(int[] body, int W, int H, int x, int y)
        {
            for (int oy = -1; oy <= 0; oy++)
            {
                int y0 = y + oy;
                if (y0 < 0 || y0 + 1 >= H) continue;
                for (int ox = -1; ox <= 0; ox++)
                {
                    int x0 = x + ox;
                    if (x0 < 0 || x0 + 1 >= W) continue;
                    int i = y0 * W + x0;
                    if (body[i] != 0 && body[i + 1] != 0 && body[i + W] != 0 && body[i + W + 1] != 0) return false;
                }
            }
            return true;
        }

        // Enclosed space of a body: empty cells that cannot reach the canvas
        // border through non-body cells (8 directions). A pocket cell is an
        // enclosed cell with no body cell among its 8 neighbours.
        public static void CountEnclosed(int[] body, int W, int H, out int enclosed, out int pockets)
        {
            int total = W * H;
            bool[] open = new bool[total];
            int[] stack = new int[total];
            int sp = 0;
            for (int y = 0; y < H; y++)
            {
                for (int x = 0; x < W; x++)
                {
                    if (x != 0 && y != 0 && x != W - 1 && y != H - 1) continue;
                    int i = y * W + x;
                    if (body[i] == 0) { open[i] = true; stack[sp++] = i; }
                }
            }
            while (sp > 0)
            {
                int k = stack[--sp];
                int x = k % W;
                int y = (k - x) / W;
                for (int oy = -1; oy <= 1; oy++)
                {
                    int yy = y + oy;
                    if (yy < 0 || yy >= H) continue;
                    for (int ox = -1; ox <= 1; ox++)
                    {
                        int xx = x + ox;
                        if (xx < 0 || xx >= W) continue;
                        int m = yy * W + xx;
                        if (body[m] != 0 || open[m]) continue;
                        open[m] = true;
                        stack[sp++] = m;
                    }
                }
            }
            enclosed = 0;
            pockets = 0;
            for (int y = 0; y < H; y++)
            {
                for (int x = 0; x < W; x++)
                {
                    int i = y * W + x;
                    if (body[i] != 0 || open[i]) continue;
                    enclosed++;
                    if (CountNeighbours(body, W, H, x, y) == 0) pockets++;
                }
            }
        }

        // Damage multiplier of an attacker element against a defender element.
        public static double ElementMultiplier(InkTuning tuning, int attacker, int defender)
        {
            if (attacker < 2 || defender < 2) return 1;
            if (tuning.Beats[attacker] == defender) return tuning.StrongMult;
            if (tuning.Beats[defender] == attacker) return tuning.WeakMult;
            return 1;
        }

        // All derived values of a drawing. kind is "figure" or "weapon" (only
        // the default budget and minimum size differ). budget null = default.
        public static InkStats ComputeStats(int[] cells, int W, int H, InkTuning tuning, string kind, double? budget)
        {
            bool isWeapon = kind == KindWeapon;
            double inkBudget = budget.HasValue ? budget.Value : (isWeapon ? tuning.WeaponBudget : tuning.FigureBudget);
            double minCells = isWeapon ? tuning.WeaponMinBodyCells : tuning.MinBodyCells;
            InkBodyExtract ex = ExtractBody(cells, W, H);
            int[] body = ex.Body;
            int N = ex.N;
            int C = 0;
            int S = 0;
            double sumX = 0;
            double sumY = 0;
            int[] colourCounts = new int[5];
            for (int y = 0; y < H; y++)
            {
                for (int x = 0; x < W; x++)
                {
                    int v = body[y * W + x];
                    if (v == 0) continue;
                    colourCounts[v]++;
                    sumX += x;
                    sumY += y;
                    int nb = CountNeighbours(body, W, H, x, y);
                    if (nb == 8) C++;
                    if (IsSharpCell(body, W, H, x, y)) S++;
                }
            }
            // centroid of cell centres
            double cx = N > 0 ? sumX / N + 0.5 : 0;
            double cy = N > 0 ? sumY / N + 0.5 : 0;
            double maxD2 = 0;
            double inertia = 0;
            for (int y = 0; y < H; y++)
            {
                for (int x = 0; x < W; x++)
                {
                    if (body[y * W + x] == 0) continue;
                    double dx = x + 0.5 - cx;
                    double dy = y + 0.5 - cy;
                    double d2 = dx * dx + dy * dy;
                    inertia += d2;
                    if (d2 > maxD2) maxD2 = d2;
                }
            }
            double radius = N > 0 ? Math.Sqrt(maxD2) + 0.5 : 0;
            // element
            int coloured = colourCounts[2] + colourCounts[3] + colourCounts[4];
            int element = ElementNeutral;
            if (N > 0 && coloured * 100 >= tuning.MinColouredPercent * N)
            {
                int best = 0;
                int bestCount = 0;
                bool tie = false;
                for (int c = 2; c <= 4; c++)
                {
                    if (colourCounts[c] > bestCount) { bestCount = colourCounts[c]; best = c; tie = false; }
                    else if (colourCounts[c] == bestCount) tie = true;
                }
                if (!tie && bestCount > 0) element = best;
            }
            InkStats s = new InkStats();
            s.Kind = isWeapon ? KindWeapon : KindFigure;
            s.Budget = inkBudget;
            s.Filled = ex.Filled;
            s.Drips = ex.Drips;
            s.N = N; s.C = C; s.S = S;
            s.ColourCounts = new int[] { colourCounts[1], colourCounts[2], colourCounts[3], colourCounts[4] };
            s.Element = element;
            s.WithinBudget = ex.Filled <= inkBudget;
            s.BigEnough = N >= minCells;
            s.Valid = s.BigEnough && s.WithinBudget;
            s.Weight = N;
            double dN = N;
            double dS = S;
            double dC = C;
            int enclosed, pockets;
            CountEnclosed(body, W, H, out enclosed, out pockets);
            double pocketCells = pockets;
            if (pocketCells > tuning.PocketCapPerCell * (dN - dS)) pocketCells = tuning.PocketCapPerCell * (dN - dS);
            s.Enclosed = enclosed;
            s.P = pockets;
            s.PocketCells = pocketCells;
            s.Push = dN + tuning.PushPerPocket * pocketCells;
            s.Armour = tuning.ArmourBase + tuning.ArmourPerCore * dC + tuning.ArmourPerCell * dN + tuning.ArmourPerPocket * pocketCells;
            s.Sharpness = tuning.SharpBase + (N > 0 ? tuning.SharpMax * (dS * dS) / (dS * dS + tuning.SharpHalfCells * tuning.SharpHalfCells)
                + tuning.SharpPurity * (dS / dN) * (dS / dN) / (1 + dN / tuning.SharpPurityWeightRef) : 0);
            s.TopSpeed = tuning.SpeedBase / (1 + dN / tuning.SpeedWeightRef);
            s.Cx = cx; s.Cy = cy; s.Radius = radius; s.Inertia = inertia;
            return s;
        }
    }
}
