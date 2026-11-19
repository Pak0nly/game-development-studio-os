// World rendering: one camera, the arena floor and pooled sprites for bodies,
// thrown weapons and ink drops. Everything is created from code. Sprites of
// figures are generated from the body cells of the drawing.
//
// Axes: the core uses x right, y down; Unity uses y up. A core position (x, y)
// is shown at (x, -y). One canvas cell is one world unit.
using System.Collections.Generic;
using Inkweight.Core;
using UnityEngine;

namespace Inkweight.Runtime
{
    public sealed class InkArenaView
    {
        public Camera Cam;

        private readonly Transform root;
        private readonly Texture2D discTexture;
        private readonly Sprite discSprite;
        private readonly SpriteRenderer rim, floor, marker;
        private readonly List<SpriteRenderer> pool = new List<SpriteRenderer>();
        private readonly Dictionary<InkFigure, Sprite> figureSprites = new Dictionary<InkFigure, Sprite>();
        private readonly List<Texture2D> figureTextures = new List<Texture2D>();
        private int used;

        private const int DiscSize = 256;

        public InkArenaView(Transform parent)
        {
            GameObject rootGo = new GameObject("Arena");
            root = rootGo.transform;
            root.SetParent(parent, false);

            GameObject camGo = new GameObject("Inkweight Camera");
            camGo.transform.SetParent(parent, false);
            camGo.transform.position = new Vector3(0f, 0f, -10f);
            Cam = camGo.AddComponent<Camera>();
            Cam.orthographic = true;
            Cam.orthographicSize = 60f;
            Cam.clearFlags = CameraClearFlags.SolidColor;
            Cam.backgroundColor = new Color(0.16f, 0.17f, 0.21f, 1f);
            Cam.depth = 100f; // draw over any camera the opened scene may contain

            // a white disc with a soft edge, one world unit across
            discTexture = new Texture2D(DiscSize, DiscSize, TextureFormat.RGBA32, false);
            discTexture.filterMode = FilterMode.Bilinear;
            discTexture.wrapMode = TextureWrapMode.Clamp;
            Color32[] px = new Color32[DiscSize * DiscSize];
            float half = DiscSize * 0.5f;
            for (int y = 0; y < DiscSize; y++)
            {
                for (int x = 0; x < DiscSize; x++)
                {
                    float dx = x + 0.5f - half;
                    float dy = y + 0.5f - half;
                    float d = Mathf.Sqrt(dx * dx + dy * dy);
                    float a = Mathf.Clamp01(half - d);
                    px[y * DiscSize + x] = new Color32(255, 255, 255, (byte)(a * 255f));
                }
            }
            discTexture.SetPixels32(px);
            discTexture.Apply(false);
            // FullRect: a plain quad. The default (Tight) would trace an outline
            // mesh from the alpha channel at run time and could trim the soft edge.
            discSprite = Sprite.Create(discTexture, new Rect(0f, 0f, DiscSize, DiscSize), new Vector2(0.5f, 0.5f), DiscSize,
                0, SpriteMeshType.FullRect);

            rim = NewRenderer("Rim", -30);
            rim.sprite = discSprite;
            rim.color = new Color(0.1f, 0.1f, 0.12f, 1f);
            floor = NewRenderer("Floor", -20);
            floor.sprite = discSprite;
            floor.color = new Color(0.96f, 0.94f, 0.88f, 1f);
            marker = NewRenderer("PlayerMarker", -10);
            marker.sprite = discSprite;
            marker.color = new Color(1f, 0.85f, 0.2f, 0.45f);
            SetVisible(false);
        }

        private SpriteRenderer NewRenderer(string name, int order)
        {
            GameObject go = new GameObject(name);
            go.transform.SetParent(root, false);
            SpriteRenderer r = go.AddComponent<SpriteRenderer>();
            r.sortingOrder = order;
            return r;
        }

        public void SetVisible(bool visible)
        {
            root.gameObject.SetActive(visible);
        }

        // Forget the sprites of finished fights (textures are engine objects
        // and must be destroyed by hand).
        public void ClearFigures()
        {
            foreach (KeyValuePair<InkFigure, Sprite> kv in figureSprites) Object.Destroy(kv.Value);
            for (int i = 0; i < figureTextures.Count; i++) Object.Destroy(figureTextures[i]);
            figureSprites.Clear();
            figureTextures.Clear();
            for (int i = 0; i < pool.Count; i++) { pool[i].sprite = null; pool[i].enabled = false; }
        }

        // Sprite of a figure: its body cells as pixels, pivot at the centroid,
        // one pixel per world unit. Unrotated it looks like the canvas.
        public Sprite SpriteFor(InkFigure fig)
        {
            Sprite s;
            if (figureSprites.TryGetValue(fig, out s)) return s;
            Texture2D tex = new Texture2D(fig.W, fig.H, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Point;
            tex.wrapMode = TextureWrapMode.Clamp;
            Color32[] px = new Color32[fig.W * fig.H];
            for (int y = 0; y < fig.H; y++)
            {
                for (int x = 0; x < fig.W; x++)
                {
                    int k = fig.Grid[y * fig.W + x];
                    Color32 c = new Color32(0, 0, 0, 0);
                    if (k >= 0)
                    {
                        int v = fig.Colour[k];
                        if (v >= 1 && v <= 4) c = InkCanvasEditor.Ink[v];
                    }
                    px[(fig.H - 1 - y) * fig.W + x] = c;
                }
            }
            tex.SetPixels32(px);
            tex.Apply(false);
            Vector2 pivot = new Vector2((float)(fig.Cx / fig.W), 1f - (float)(fig.Cy / fig.H));
            s = Sprite.Create(tex, new Rect(0f, 0f, fig.W, fig.H), pivot, 1f, 0, SpriteMeshType.FullRect);
            figureSprites[fig] = s;
            figureTextures.Add(tex);
            return s;
        }

        // Fit the arena into the screen, leaving room for the HUD.
        public void Frame(double radius)
        {
            float r = (float)radius * 1.12f + 4f;
            float aspect = Screen.height > 0 ? (float)Screen.width / Screen.height : 1f;
            Cam.orthographicSize = aspect >= 1f ? r : r / aspect;
        }

        public void BeginFrame(double arenaRadius)
        {
            used = 0;
            float d = (float)arenaRadius * 2f;
            floor.transform.localScale = new Vector3(d, d, 1f);
            rim.transform.localScale = new Vector3(d + 1.6f, d + 1.6f, 1f);
            marker.enabled = false;
        }

        private SpriteRenderer Next()
        {
            if (used == pool.Count) pool.Add(NewRenderer("Sprite " + used, 0));
            SpriteRenderer r = pool[used++];
            r.enabled = true;
            return r;
        }

        // Rotation that turns the canvas-up direction onto the front vector.
        private static Quaternion Facing(double fx, double fy)
        {
            float angle = Mathf.Atan2(-(float)fx, -(float)fy) * Mathf.Rad2Deg;
            return Quaternion.Euler(0f, 0f, angle);
        }

        public void DrawBody(InkBody b, bool isPlayer, bool flash, int order)
        {
            if (!b.Alive) return;
            SpriteRenderer r = Next();
            r.sprite = SpriteFor(b.Fig);
            r.sortingOrder = order;
            r.color = flash ? new Color(1f, 0.55f, 0.55f, 1f) : new Color(1f, 1f, 1f, 1f);
            Transform t = r.transform;
            t.position = new Vector3((float)b.X, -(float)b.Y, 0f);
            t.rotation = Facing(b.Fx, b.Fy);
            t.localScale = new Vector3(1f, 1f, 1f);
            if (isPlayer)
            {
                float d = (float)b.Fig.Radius * 2f + 3f;
                marker.enabled = true;
                marker.transform.position = new Vector3((float)b.X, -(float)b.Y, 0f);
                marker.transform.localScale = new Vector3(d, d, 1f);
            }
        }

        public void DrawShot(InkShot s, InkFigure weapon)
        {
            SpriteRenderer r = Next();
            r.sprite = SpriteFor(weapon);
            r.sortingOrder = 20;
            r.color = new Color(1f, 1f, 1f, 1f);
            Transform t = r.transform;
            t.position = new Vector3((float)s.X, -(float)s.Y, 0f);
            t.rotation = Facing(s.Ux, s.Uy);
            t.localScale = new Vector3(0.5f, 0.5f, 1f);
        }

        public void DrawDrop(InkDrop d)
        {
            SpriteRenderer r = Next();
            r.sprite = discSprite;
            r.sortingOrder = -5;
            r.color = new Color(0.1f, 0.1f, 0.14f, 0.85f);
            Transform t = r.transform;
            t.position = new Vector3((float)d.X, -(float)d.Y, 0f);
            t.rotation = Quaternion.identity;
            float size = 1.2f + Mathf.Sqrt((float)d.Value) * 0.25f;
            t.localScale = new Vector3(size, size, 1f);
        }

        public void EndFrame()
        {
            for (int i = used; i < pool.Count; i++) pool[i].enabled = false;
        }

        // Core position to virtual GUI coordinates (for bars over figures).
        // Assumes the camera is centred on the world origin and not rotated,
        // which holds because both arenas are centred at (0, 0) in the core.
        // If the camera ever moves or zooms around another point, subtract its
        // position here (or use Camera.WorldToScreenPoint).
        public Vector2 WorldToGui(double x, double y, float guiScale)
        {
            float halfH = Cam.orthographicSize;
            float aspect = Screen.height > 0 ? (float)Screen.width / Screen.height : 1f;
            float halfW = halfH * aspect;
            float sx = ((float)x / halfW * 0.5f + 0.5f) * Screen.width;
            float sy = ((float)y / halfH * 0.5f + 0.5f) * Screen.height;
            return new Vector2(sx / guiScale, sy / guiScale);
        }
    }
}
