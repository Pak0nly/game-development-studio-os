using UnityEngine;

namespace SideScrollerWorkflowTest.Phase2
{
    public static class Phase2Visuals
    {
        private const string MaterialRoot = "Phase2Materials/";

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Apply()
        {
            Transform level = GameObject.Find("RuntimeLevel")?.transform;
            if (level == null || GameObject.Find("Phase 2 Backgrounds") != null)
            {
                return;
            }

            ApplyMaterial("Start Platform", "M_Ground_Stone");
            ApplyMaterial("Low Platform", "M_Ground_Stone");
            ApplyMaterial("Middle Platform", "M_Ground_Stone");
            ApplyMaterial("Obstacle Platform", "M_Ground_Stone");
            ApplyMaterial("Step One", "M_Platform_Raised");
            ApplyMaterial("Step Two", "M_Platform_Raised");
            ApplyMaterial("Final Step", "M_Platform_Raised");
            ApplyMaterial("Moving Platform", "M_MovingPlatform_Stripes");
            ApplyMaterial("Moving Obstacle", "M_Obstacle_Chevrons");

            Material background = Resources.Load<Material>(MaterialRoot + "M_Background_Ruins");
            if (background == null)
            {
                Debug.LogError("SIDESCROLLER_PHASE2_BACKGROUND_MATERIAL_MISSING");
                return;
            }

            Transform backgrounds = new GameObject("Phase 2 Backgrounds").transform;
            backgrounds.SetParent(level, false);
            CreateBackgroundLayer(backgrounds, "Far Ruins", background, new Vector3(1f, 4.5f, 8f), new Vector2(82f, 21f), new Color(0.28f, 0.38f, 0.55f));
            CreateBackgroundLayer(backgrounds, "Near Ruins", background, new Vector3(1f, 0.5f, 4f), new Vector2(74f, 9f), new Color(0.42f, 0.55f, 0.66f));
            Debug.Log("SIDESCROLLER_PHASE2_VISUALS_APPLIED");
        }

        private static void ApplyMaterial(string objectName, string materialName)
        {
            GameObject target = GameObject.Find(objectName);
            Material material = Resources.Load<Material>(MaterialRoot + materialName);
            Renderer renderer = target != null ? target.GetComponent<Renderer>() : null;
            if (renderer == null || material == null)
            {
                Debug.LogError($"SIDESCROLLER_PHASE2_ASSIGNMENT_MISSING: {objectName} / {materialName}");
                return;
            }

            renderer.sharedMaterial = material;
        }

        private static void CreateBackgroundLayer(Transform parent, string name, Material source, Vector3 position, Vector2 size, Color tint)
        {
            GameObject layer = new GameObject(name);
            layer.transform.SetParent(parent, false);
            layer.transform.position = position;

            Mesh mesh = new Mesh { name = name + " Mesh" };
            mesh.vertices = new[]
            {
                new Vector3(-size.x * 0.5f, -size.y * 0.5f, 0f),
                new Vector3(size.x * 0.5f, -size.y * 0.5f, 0f),
                new Vector3(-size.x * 0.5f, size.y * 0.5f, 0f),
                new Vector3(size.x * 0.5f, size.y * 0.5f, 0f)
            };
            mesh.uv = new[] { Vector2.zero, Vector2.right, Vector2.up, Vector2.one };
            mesh.triangles = new[] { 0, 2, 1, 2, 3, 1 };
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();
            layer.AddComponent<MeshFilter>().sharedMesh = mesh;

            Material instance = new Material(source) { name = name + " Material", color = tint };
            MeshRenderer renderer = layer.AddComponent<MeshRenderer>();
            renderer.sharedMaterial = instance;
            renderer.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            renderer.receiveShadows = false;
        }
    }
}
