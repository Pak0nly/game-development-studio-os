// The 32 x 32 drawing canvas: cells, ink budget, live stats and the texture
// that shows it. Painting is done by the game component from GUI mouse events
// (a touch arrives there as a mouse event as well).
using Inkweight.Core;
using UnityEngine;

namespace Inkweight.Runtime
{
    public sealed class InkCanvasEditor
    {
        public int W, H;
        public int[] Cells;
        public double Budget;
        public string Kind = InkDrawing.KindFigure; // InkDrawing.KindFigure or KindWeapon
        public bool[] Allowed = { true, true, true, true, true }; // index = colour number
        public int Tool = 1;                 // 0 eraser, 1..4 colours
        public InkStats Stats;
        public bool InkEmptyFlash;           // the last stroke was refused: no ink left
        public Texture2D Texture;

        private readonly InkTuning tuning;
        private int[] body;
        private Color32[] pixels;
        private int lastX = -1, lastY = -1;

        public static readonly Color32 Paper = new Color32(245, 240, 225, 255);
        public static readonly Color32 PaperAlt = new Color32(236, 230, 212, 255);
        public static readonly Color32[] Ink =
        {
            new Color32(0, 0, 0, 0),
            new Color32(28, 28, 34, 255),    // Black
            new Color32(214, 64, 48, 255),   // Ember
            new Color32(48, 110, 214, 255),  // Tide
            new Color32(70, 160, 78, 255),   // Moss
        };

        public InkCanvasEditor(InkTuning tuning)
        {
            this.tuning = tuning;
            W = tuning.CanvasWidth;
            H = tuning.CanvasHeight;
            Cells = InkDrawing.Empty(W, H);
            pixels = new Color32[W * H];
            Texture = new Texture2D(W, H, TextureFormat.RGBA32, false);
            Texture.filterMode = FilterMode.Point;
            Texture.wrapMode = TextureWrapMode.Clamp;
            Budget = tuning.FigureBudget;
            Refresh();
        }

        // Start editing. cells may be null (empty canvas); the array is copied.
        public void Begin(int[] cells, double budget, string kind, bool[] allowed)
        {
            Cells = InkDrawing.Empty(W, H);
            if (cells != null && cells.Length == Cells.Length)
            {
                for (int i = 0; i < Cells.Length; i++) Cells[i] = cells[i];
            }
            Budget = budget;
            Kind = kind;
            for (int c = 0; c < Allowed.Length; c++) Allowed[c] = allowed == null || (c < allowed.Length && allowed[c]);
            Allowed[1] = true;
            // ink of a colour that is not unlocked is removed
            for (int i = 0; i < Cells.Length; i++) if (Cells[i] != 0 && !Allowed[Cells[i]]) Cells[i] = 1;
            if (Tool != 0 && !Allowed[Tool]) Tool = 1;
            InkEmptyFlash = false;
            EndStroke();
            Refresh();
        }

        public int[] CopyCells()
        {
            int[] c = new int[Cells.Length];
            for (int i = 0; i < c.Length; i++) c[i] = Cells[i];
            return c;
        }

        public void ClearAll()
        {
            for (int i = 0; i < Cells.Length; i++) Cells[i] = 0;
            InkEmptyFlash = false;
            Refresh();
        }

        public void EndStroke() { lastX = -1; lastY = -1; }

        // Paint from the previous stroke cell to (x, y) so that fast strokes
        // leave no gaps. value 0 erases.
        public void StrokeTo(int x, int y, int value)
        {
            if (x < 0 || y < 0 || x >= W || y >= H) { EndStroke(); return; }
            int x0 = lastX < 0 ? x : lastX;
            int y0 = lastY < 0 ? y : lastY;
            int dx = x > x0 ? x - x0 : x0 - x;
            int dy = y > y0 ? y - y0 : y0 - y;
            int sx = x0 < x ? 1 : -1;
            int sy = y0 < y ? 1 : -1;
            int err = dx - dy;
            bool changed = false;
            for (int guard = 0; guard < W + H + 4; guard++)
            {
                if (SetCell(x0, y0, value)) changed = true;
                if (x0 == x && y0 == y) break;
                int e2 = 2 * err;
                if (e2 > -dy) { err -= dy; x0 += sx; }
                if (e2 < dx) { err += dx; y0 += sy; }
            }
            lastX = x;
            lastY = y;
            if (changed) Refresh();
        }

        private bool SetCell(int x, int y, int value)
        {
            int i = y * W + x;
            if (Cells[i] == value) return false;
            if (value != 0)
            {
                if (value < 1 || value > 4 || !Allowed[value]) return false;
                if (Cells[i] == 0 && Stats != null && CountFilled() >= Budget) { InkEmptyFlash = true; return false; }
            }
            Cells[i] = value;
            InkEmptyFlash = false;
            return true;
        }

        private int CountFilled()
        {
            int n = 0;
            for (int i = 0; i < Cells.Length; i++) if (Cells[i] != 0) n++;
            return n;
        }

        // Recompute the stats and repaint the texture. Cells that drip off (not
        // part of the body) are shown pale.
        public void Refresh()
        {
            Stats = InkDrawing.ComputeStats(Cells, W, H, tuning, Kind, Budget);
            body = InkDrawing.ExtractBody(Cells, W, H).Body;
            for (int y = 0; y < H; y++)
            {
                for (int x = 0; x < W; x++)
                {
                    int i = y * W + x;
                    Color32 c = ((x + y) & 1) == 0 ? Paper : PaperAlt;
                    int v = Cells[i];
                    if (v >= 1 && v <= 4)
                    {
                        Color32 ink = Ink[v];
                        if (body[i] != 0) c = ink;
                        else c = new Color32((byte)((ink.r + 2 * c.r) / 3), (byte)((ink.g + 2 * c.g) / 3), (byte)((ink.b + 2 * c.b) / 3), 255);
                    }
                    // texture row 0 is the bottom row, canvas row 0 is the top
                    pixels[(H - 1 - y) * W + x] = c;
                }
            }
            Texture.SetPixels32(pixels);
            Texture.Apply(false);
        }
    }
}
