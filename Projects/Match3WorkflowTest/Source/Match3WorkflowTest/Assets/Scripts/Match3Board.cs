using System;
using System.Collections.Generic;

namespace Match3WorkflowTest
{
    public sealed class Match3Board
    {
        public const int Width = 8;
        public const int Height = 8;
        public const int StoneTypeCount = 5;

        private readonly int[,] cells = new int[Width, Height];
        private readonly Random random;

        public int Score { get; private set; }

        public Match3Board(int seed = 0)
        {
            random = seed == 0 ? new Random() : new Random(seed);
            Restart();
        }

        public int GetStone(int x, int y)
        {
            return cells[x, y];
        }

        public void Restart()
        {
            Score = 0;

            for (int attempt = 0; attempt < 100; attempt++)
            {
                FillWithoutInitialMatches();
                if (HasPossibleMove())
                {
                    return;
                }
            }

            throw new InvalidOperationException("Could not generate a playable board.");
        }

        public bool TrySwap(int firstX, int firstY, int secondX, int secondY)
        {
            if (!IsInside(firstX, firstY) || !IsInside(secondX, secondY))
            {
                return false;
            }

            int distance = Math.Abs(firstX - secondX) + Math.Abs(firstY - secondY);
            if (distance != 1)
            {
                return false;
            }

            Swap(firstX, firstY, secondX, secondY);
            HashSet<int> matches = FindMatches();
            if (matches.Count == 0)
            {
                Swap(firstX, firstY, secondX, secondY);
                return false;
            }

            ResolveMatches(matches);
            return true;
        }

        public HashSet<int> FindMatches()
        {
            HashSet<int> matches = new HashSet<int>();

            for (int y = 0; y < Height; y++)
            {
                int runStart = 0;
                for (int x = 1; x <= Width; x++)
                {
                    bool continues = x < Width && cells[x, y] == cells[runStart, y];
                    if (continues)
                    {
                        continue;
                    }

                    if (cells[runStart, y] >= 0 && x - runStart >= 3)
                    {
                        for (int matchX = runStart; matchX < x; matchX++)
                        {
                            matches.Add(ToIndex(matchX, y));
                        }
                    }

                    runStart = x;
                }
            }

            for (int x = 0; x < Width; x++)
            {
                int runStart = 0;
                for (int y = 1; y <= Height; y++)
                {
                    bool continues = y < Height && cells[x, y] == cells[x, runStart];
                    if (continues)
                    {
                        continue;
                    }

                    if (cells[x, runStart] >= 0 && y - runStart >= 3)
                    {
                        for (int matchY = runStart; matchY < y; matchY++)
                        {
                            matches.Add(ToIndex(x, matchY));
                        }
                    }

                    runStart = y;
                }
            }

            return matches;
        }

        public void LoadForTesting(int[,] values)
        {
            if (values.GetLength(0) != Width || values.GetLength(1) != Height)
            {
                throw new ArgumentException("Test board must be 8x8.", nameof(values));
            }

            Array.Copy(values, cells, values.Length);
            Score = 0;
        }

        private void FillWithoutInitialMatches()
        {
            for (int y = 0; y < Height; y++)
            {
                for (int x = 0; x < Width; x++)
                {
                    int stone;
                    do
                    {
                        stone = random.Next(StoneTypeCount);
                    }
                    while ((x >= 2 && cells[x - 1, y] == stone && cells[x - 2, y] == stone) ||
                           (y >= 2 && cells[x, y - 1] == stone && cells[x, y - 2] == stone));

                    cells[x, y] = stone;
                }
            }
        }

        private bool HasPossibleMove()
        {
            for (int y = 0; y < Height; y++)
            {
                for (int x = 0; x < Width; x++)
                {
                    if (x + 1 < Width && SwapCreatesMatch(x, y, x + 1, y))
                    {
                        return true;
                    }

                    if (y + 1 < Height && SwapCreatesMatch(x, y, x, y + 1))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private bool SwapCreatesMatch(int firstX, int firstY, int secondX, int secondY)
        {
            Swap(firstX, firstY, secondX, secondY);
            bool createsMatch = FindMatches().Count > 0;
            Swap(firstX, firstY, secondX, secondY);
            return createsMatch;
        }

        private void ResolveMatches(HashSet<int> matches)
        {
            int cascadeLimit = 100;
            while (matches.Count > 0 && cascadeLimit-- > 0)
            {
                Score += matches.Count * 10;
                foreach (int index in matches)
                {
                    cells[index % Width, index / Width] = -1;
                }

                CollapseAndRefill();
                matches = FindMatches();
            }

            if (cascadeLimit <= 0)
            {
                throw new InvalidOperationException("Cascade safety limit reached.");
            }

            if (!HasPossibleMove())
            {
                FillWithoutInitialMatches();
            }
        }

        private void CollapseAndRefill()
        {
            for (int x = 0; x < Width; x++)
            {
                int writeY = 0;
                for (int readY = 0; readY < Height; readY++)
                {
                    if (cells[x, readY] < 0)
                    {
                        continue;
                    }

                    cells[x, writeY] = cells[x, readY];
                    writeY++;
                }

                while (writeY < Height)
                {
                    cells[x, writeY] = random.Next(StoneTypeCount);
                    writeY++;
                }
            }
        }

        private void Swap(int firstX, int firstY, int secondX, int secondY)
        {
            int value = cells[firstX, firstY];
            cells[firstX, firstY] = cells[secondX, secondY];
            cells[secondX, secondY] = value;
        }

        private static bool IsInside(int x, int y)
        {
            return x >= 0 && x < Width && y >= 0 && y < Height;
        }

        private static int ToIndex(int x, int y)
        {
            return y * Width + x;
        }
    }
}
