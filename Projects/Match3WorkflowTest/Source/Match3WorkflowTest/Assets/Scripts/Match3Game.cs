using UnityEngine;

namespace Match3WorkflowTest
{
    public sealed class Match3Game : MonoBehaviour
    {
        private static readonly Color[] StoneColors =
        {
            new Color(0.95f, 0.25f, 0.25f),
            new Color(0.25f, 0.55f, 1.00f),
            new Color(0.30f, 0.85f, 0.35f),
            new Color(1.00f, 0.80f, 0.20f),
            new Color(0.70f, 0.35f, 0.95f)
        };

        private Match3Board board;
        private Texture2D backgroundTexture;
        private Texture2D[] stoneTextures;
        private Texture2D selectedTexture;
        private GUIStyle titleStyle;
        private GUIStyle scoreStyle;
        private GUIStyle messageStyle;
        private int selectedX = -1;
        private int selectedY = -1;
        private string message = "Select two neighboring stones.";

        private void Awake()
        {
            InitializeIfNeeded();
        }

        private void Start()
        {
            Debug.Log("MATCH3_PLAY_MODE_STARTED");
        }

        private void OnDestroy()
        {
            if (stoneTextures != null)
            {
                foreach (Texture2D texture in stoneTextures)
                {
                    Destroy(texture);
                }
            }

            if (selectedTexture != null)
            {
                Destroy(selectedTexture);
            }

            if (backgroundTexture != null)
            {
                Destroy(backgroundTexture);
            }
        }

        private void OnGUI()
        {
            InitializeIfNeeded();
            EnsureStyles();
            GUI.DrawTexture(new Rect(0f, 0f, Screen.width, Screen.height), backgroundTexture);

            float cellSize = Mathf.Clamp(Mathf.Min(Screen.width * 0.075f, Screen.height * 0.085f), 42f, 76f);
            float boardSize = cellSize * Match3Board.Width;
            float left = (Screen.width - boardSize) * 0.5f;
            float top = Mathf.Max(105f, (Screen.height - boardSize) * 0.55f);

            GUI.Label(new Rect(0f, 18f, Screen.width, 40f), "MATCH-3 WORKFLOW TEST", titleStyle);
            GUI.Label(new Rect(0f, 60f, Screen.width, 30f), $"Score: {board.Score}", scoreStyle);

            for (int y = Match3Board.Height - 1; y >= 0; y--)
            {
                int displayY = Match3Board.Height - 1 - y;
                for (int x = 0; x < Match3Board.Width; x++)
                {
                    Rect rect = new Rect(left + x * cellSize, top + displayY * cellSize, cellSize - 3f, cellSize - 3f);
                    GUIStyle style = new GUIStyle(GUI.skin.button)
                    {
                        normal = { background = stoneTextures[board.GetStone(x, y)] },
                        hover = { background = stoneTextures[board.GetStone(x, y)] },
                        active = { background = stoneTextures[board.GetStone(x, y)] }
                    };

                    if (GUI.Button(rect, GUIContent.none, style))
                    {
                        SelectStone(x, y);
                    }

                    if (x == selectedX && y == selectedY)
                    {
                        GUI.DrawTexture(new Rect(rect.x + 5f, rect.y + 5f, rect.width - 10f, rect.height - 10f), selectedTexture);
                    }
                }
            }

            float controlsTop = top + boardSize + 12f;
            GUI.Label(new Rect(0f, controlsTop, Screen.width, 26f), message, messageStyle);
            if (GUI.Button(new Rect((Screen.width - 180f) * 0.5f, controlsTop + 32f, 180f, 38f), "Restart"))
            {
                board.Restart();
                ClearSelection();
                message = "New board created.";
            }
        }

        private void SelectStone(int x, int y)
        {
            if (selectedX < 0)
            {
                selectedX = x;
                selectedY = y;
                message = "Now select a neighboring stone.";
                return;
            }

            if (selectedX == x && selectedY == y)
            {
                ClearSelection();
                message = "Selection cleared.";
                return;
            }

            int distance = Mathf.Abs(selectedX - x) + Mathf.Abs(selectedY - y);
            if (distance != 1)
            {
                selectedX = x;
                selectedY = y;
                message = "Selected a different stone.";
                return;
            }

            bool valid = board.TrySwap(selectedX, selectedY, x, y);
            ClearSelection();
            message = valid ? "Match! Board refilled." : "No match - swap reverted.";
        }

        private void ClearSelection()
        {
            selectedX = -1;
            selectedY = -1;
        }

        private void CreateTextures()
        {
            backgroundTexture = CreateTexture(new Color(0.08f, 0.09f, 0.13f, 1f));
            stoneTextures = new Texture2D[StoneColors.Length];
            for (int i = 0; i < StoneColors.Length; i++)
            {
                stoneTextures[i] = CreateTexture(StoneColors[i]);
            }

            selectedTexture = CreateTexture(new Color(1f, 1f, 1f, 0.72f));
        }

        private void InitializeIfNeeded()
        {
            if (board == null)
            {
                board = new Match3Board();
            }

            if (backgroundTexture == null || stoneTextures == null || selectedTexture == null)
            {
                CreateTextures();
            }
        }

        private static Texture2D CreateTexture(Color color)
        {
            Texture2D texture = new Texture2D(1, 1, TextureFormat.RGBA32, false);
            texture.SetPixel(0, 0, color);
            texture.Apply();
            return texture;
        }

        private void EnsureStyles()
        {
            if (titleStyle != null)
            {
                return;
            }

            titleStyle = new GUIStyle(GUI.skin.label)
            {
                alignment = TextAnchor.MiddleCenter,
                fontSize = 28,
                fontStyle = FontStyle.Bold
            };
            scoreStyle = new GUIStyle(GUI.skin.label)
            {
                alignment = TextAnchor.MiddleCenter,
                fontSize = 22,
                fontStyle = FontStyle.Bold
            };
            messageStyle = new GUIStyle(GUI.skin.label)
            {
                alignment = TextAnchor.MiddleCenter,
                fontSize = 16
            };
        }
    }
}
