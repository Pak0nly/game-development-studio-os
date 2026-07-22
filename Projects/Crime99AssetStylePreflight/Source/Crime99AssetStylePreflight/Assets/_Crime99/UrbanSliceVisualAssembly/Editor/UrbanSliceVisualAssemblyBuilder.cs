using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.SceneManagement;

namespace Crime99.UrbanSliceVisualAssembly.Editor
{
    public static class UrbanSliceVisualAssemblyBuilder
    {
        private const string Root = "Assets/_Crime99/UrbanSliceVisualAssembly";
        private const string ScenePath = Root + "/Scenes/C99_UrbanSlice_VisualAssembly.unity";
        private const string EvidenceDirectory = Root + "/Evidence";
        private const string FinalEvidenceDirectory = EvidenceDirectory + "/Final";
        private const string FrozenSceneSha256 = "921FDE22A4CBCC2D05D2FD82208107E6FF8B3FA1CE6894C3E45E9256C3A8ACC8";
        private const int CaptureWidth = 1280;
        private const int CaptureHeight = 720;

        [Serializable]
        private sealed class PlacementRecord
        {
            public string name;
            public string prefabPath;
            public Vector3 position;
            public Vector3 eulerAngles;
            public Vector3 scale;
            public Vector3 boundsCenter;
            public Vector3 boundsSize;
            public int rendererCount;
            public int materialSlotCount;
        }

        [Serializable]
        private sealed class CaptureRecord
        {
            public string name;
            public string path;
            public string sha256;
            public int magentaLikePixels;
            public int uniqueColorCount;
            public int nonBackgroundPixels;
        }

        [Serializable]
        private sealed class PlacementManifest
        {
            public string requestedModel = "gpt-5.6-terra";
            public string attestation = "Requested model — not independently attested.";
            public string scenePath = ScenePath;
            public string publicFrontConvention = "Prefab local -Z; west yaw -90 faces +X, east yaw +90 faces -X.";
            public string scope = "First bounded StylePreflight visual assembly; no gameplay or final dressing.";
            public PlacementRecord[] placements;
            public CaptureRecord[] captures;
            public string[] validationFindings;
        }

        private sealed class BuildingInstance
        {
            public GameObject GameObject;
            public PlacementRecord Record;
            public Bounds Bounds;
        }

        [MenuItem("Crime99/Build Bounded Urban Slice Visual Assembly")]
        public static void BuildFromMenu()
        {
            Build();
        }

        public static void BuildFromCommandLine()
        {
            try
            {
                Build();
                Debug.Log("C99_VISUAL_ASSEMBLY_BUILD_SUCCESS");
                EditorApplication.Exit(0);
            }
            catch (Exception exception)
            {
                Debug.LogException(exception);
                Debug.LogError("C99_VISUAL_ASSEMBLY_BUILD_FAILED");
                EditorApplication.Exit(1);
            }
        }

        public static void CaptureFinalEvidenceFromExistingScene()
        {
            try
            {
                string sceneAbsolutePath = ToAbsolutePath(ScenePath);
                string beforeHash = ComputeSha256(File.ReadAllBytes(sceneAbsolutePath));
                if (!string.Equals(beforeHash, FrozenSceneSha256, StringComparison.Ordinal))
                {
                    throw new InvalidOperationException("Frozen scene hash mismatch before capture: " + beforeHash);
                }

                Directory.CreateDirectory(ToAbsolutePath(FinalEvidenceDirectory));
                EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);

                Camera entrance = CreateCamera(
                    "C99_Temporary_Final_Entrance_Camera",
                    new Vector3(-1.8f, 4.6f, -15.5f),
                    new Vector3(-8.3f, 2.1f, -7.0f),
                    42f);
                Camera placementMap = CreateCamera(
                    "C99_Temporary_Final_Placement_Map_Camera",
                    new Vector3(0f, 70f, 3f),
                    new Vector3(0f, 0f, 3f),
                    50f);
                placementMap.orthographic = true;
                placementMap.orthographicSize = 45f;

                List<CaptureRecord> captures = new List<CaptureRecord>
                {
                    Capture("entrance", entrance, FinalEvidenceDirectory),
                    Capture("placement_map", placementMap, FinalEvidenceDirectory)
                };
                ValidateCaptures(captures);

                UnityEngine.Object.DestroyImmediate(entrance.gameObject);
                UnityEngine.Object.DestroyImmediate(placementMap.gameObject);

                string afterHash = ComputeSha256(File.ReadAllBytes(sceneAbsolutePath));
                if (!string.Equals(beforeHash, afterHash, StringComparison.Ordinal))
                {
                    throw new InvalidOperationException("Frozen scene changed during capture-only execution.");
                }

                Debug.Log("C99_FINAL_CAPTURE_ONLY_SUCCESS");
                foreach (CaptureRecord capture in captures)
                {
                    Debug.Log("C99_FINAL_CAPTURE " + capture.name + " " + capture.sha256 +
                              " unique=" + capture.uniqueColorCount +
                              " foreground=" + capture.nonBackgroundPixels +
                              " magenta=" + capture.magentaLikePixels);
                }
                EditorApplication.Exit(0);
            }
            catch (Exception exception)
            {
                Debug.LogException(exception);
                Debug.LogError("C99_FINAL_CAPTURE_ONLY_FAILED");
                EditorApplication.Exit(1);
            }
        }

        private static void Build()
        {
            EnsureDirectories();
            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            scene.name = "C99_UrbanSlice_VisualAssembly";

            Material roadMaterial = CreateMaterial(Root + "/Materials/C99_Road.mat", new Color(0.105f, 0.115f, 0.12f), 0.18f);
            Material sidewalkMaterial = CreateMaterial(Root + "/Materials/C99_Sidewalk.mat", new Color(0.43f, 0.43f, 0.40f), 0.22f);
            Material curbMaterial = CreateMaterial(Root + "/Materials/C99_Curb.mat", new Color(0.55f, 0.54f, 0.49f), 0.20f);

            GameObject infrastructure = new GameObject("C99_Minimal_Infrastructure");
            CreateCube("Road", new Vector3(0f, -0.16f, 3f), new Vector3(9.5f, 0.3f, 78f), roadMaterial, infrastructure.transform);
            CreateCube("Sidewalk_West", new Vector3(-6.6f, -0.06f, 3f), new Vector3(3.5f, 0.16f, 78f), sidewalkMaterial, infrastructure.transform);
            CreateCube("Sidewalk_East", new Vector3(6.6f, -0.06f, 3f), new Vector3(3.5f, 0.16f, 78f), sidewalkMaterial, infrastructure.transform);
            CreateCube("Curb_West", new Vector3(-4.83f, 0.03f, 3f), new Vector3(0.18f, 0.22f, 78f), curbMaterial, infrastructure.transform);
            CreateCube("Curb_East", new Vector3(4.83f, 0.03f, 3f), new Vector3(0.18f, 0.22f, 78f), curbMaterial, infrastructure.transform);

            GameObject buildings = new GameObject("C99_Vendor_Buildings");
            List<BuildingInstance> instances = new List<BuildingInstance>
            {
                InstantiateBuilding("West_SM5", "Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_5.prefab", new Vector3(-12.16f, 4.35f, -21f), -90f, 0.82f, buildings.transform),
                InstantiateBuilding("West_SM24", "Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_24.prefab", new Vector3(-13.71f, 8.04f, -6f), -90f, 0.82f, buildings.transform),
                InstantiateBuilding("West_SM17", "Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_17.prefab", new Vector3(-12.56f, 7.71f, 8.3f), -90f, 0.82f, buildings.transform),
                InstantiateBuilding("West_Landmark_SM36", "Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_36.prefab", new Vector3(-13.04f, 10.30f, 28f), -90f, 1f, buildings.transform),
                InstantiateBuilding("East_SM2", "Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_2.prefab", new Vector3(13.28f, 7.51f, -21f), 90f, 0.82f, buildings.transform),
                InstantiateBuilding("East_SM17", "Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_17.prefab", new Vector3(12.56f, 7.71f, -7f), 90f, 0.82f, buildings.transform),
                InstantiateBuilding("East_SM25", "Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_25.prefab", new Vector3(13.04f, 6.93f, 8.5f), 90f, 0.82f, buildings.transform),
                InstantiateBuilding("East_Service_SM38", "Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_38.prefab", new Vector3(13.36f, 3.14f, 28f), 90f, 0.82f, buildings.transform)
            };

            CreateNeutralLighting();
            Camera overview = CreateCamera("C99_Camera_Overview", new Vector3(0f, 12f, -42f), new Vector3(0f, 1.45f, 1.5f), 48f);
            Camera west = CreateCamera("C99_Camera_Frontage_West", new Vector3(-2.3f, 7f, -27f), new Vector3(-8.2f, 1.8f, -9f), 48f);
            Camera east = CreateCamera("C99_Camera_Frontage_East", new Vector3(2.3f, 7f, -27f), new Vector3(8.2f, 1.8f, -9f), 48f);
            Camera service = CreateCamera("C99_Camera_Service", new Vector3(3.5f, 8.5f, 16.5f), new Vector3(12.5f, 1.4f, 28f), 51f);
            Camera street = CreateCamera("C99_Camera_Street", new Vector3(0f, 2.1f, -32f), new Vector3(0f, 2.0f, 18f), 55f);
            Camera landmark = CreateCamera("C99_Camera_Landmark", new Vector3(0f, 9f, 10f), new Vector3(-12.5f, 8f, 28f), 48f);
            overview.tag = "MainCamera";

            List<string> findings = Validate(instances);
            EditorSceneManager.SaveScene(scene, ScenePath, true);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);

            List<CaptureRecord> captures = new List<CaptureRecord>
            {
                Capture("overview", overview),
                Capture("west", west),
                Capture("east", east),
                Capture("landmark", landmark),
                Capture("service", service),
                Capture("street", street)
            };
            ValidateCaptures(captures);

            PlacementManifest manifest = new PlacementManifest
            {
                placements = instances.Select(instance => instance.Record).ToArray(),
                captures = captures.ToArray(),
                validationFindings = findings.ToArray()
            };
            File.WriteAllText(ToAbsolutePath(EvidenceDirectory + "/PlacementManifest.json"), JsonUtility.ToJson(manifest, true));
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            EditorSceneManager.SaveScene(scene, ScenePath, true);
            AssetDatabase.SaveAssets();
        }

        private static void EnsureDirectories()
        {
            Directory.CreateDirectory(ToAbsolutePath(Root + "/Scenes"));
            Directory.CreateDirectory(ToAbsolutePath(Root + "/Materials"));
            Directory.CreateDirectory(ToAbsolutePath(EvidenceDirectory));
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
        }

        private static string ToAbsolutePath(string assetPath)
        {
            string projectRoot = Directory.GetParent(Application.dataPath).FullName;
            return Path.GetFullPath(Path.Combine(projectRoot, assetPath));
        }

        private static Material CreateMaterial(string path, Color color, float smoothness)
        {
            Material existing = AssetDatabase.LoadAssetAtPath<Material>(path);
            if (existing != null)
            {
                return existing;
            }

            Shader shader = Shader.Find("Universal Render Pipeline/Lit");
            if (shader == null)
            {
                throw new InvalidOperationException("Universal Render Pipeline/Lit shader was not found.");
            }

            Material material = new Material(shader) { name = Path.GetFileNameWithoutExtension(path) };
            material.SetColor("_BaseColor", color);
            material.SetFloat("_Smoothness", smoothness);
            AssetDatabase.CreateAsset(material, path);
            return material;
        }

        private static GameObject CreateCube(string name, Vector3 position, Vector3 scale, Material material, Transform parent)
        {
            GameObject cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
            cube.name = name;
            cube.transform.SetParent(parent, false);
            cube.transform.position = position;
            cube.transform.localScale = scale;
            cube.GetComponent<Renderer>().sharedMaterial = material;
            return cube;
        }

        private static BuildingInstance InstantiateBuilding(string name, string prefabPath, Vector3 position, float yaw, float uniformScale, Transform parent)
        {
            GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);
            if (prefab == null)
            {
                throw new FileNotFoundException("Required prefab was not found.", prefabPath);
            }

            GameObject instance = PrefabUtility.InstantiatePrefab(prefab) as GameObject;
            if (instance == null)
            {
                throw new InvalidOperationException("Could not instantiate prefab: " + prefabPath);
            }

            instance.name = name;
            instance.transform.SetParent(parent, true);
            instance.transform.SetPositionAndRotation(position, Quaternion.Euler(0f, yaw, 0f));
            instance.transform.localScale = Vector3.one * uniformScale;

            Renderer[] renderers = instance.GetComponentsInChildren<Renderer>(true);
            if (renderers.Length == 0)
            {
                throw new InvalidOperationException("Prefab has no renderers: " + prefabPath);
            }

            Bounds bounds = renderers[0].bounds;
            foreach (Renderer renderer in renderers.Skip(1))
            {
                bounds.Encapsulate(renderer.bounds);
            }

            bool isWest = name.StartsWith("West", StringComparison.Ordinal);
            float desiredRoadFace = isWest ? -8.30f : 8.30f;
            float currentRoadFace = isWest ? bounds.max.x : bounds.min.x;
            Vector3 boundsCorrection = new Vector3(
                desiredRoadFace - currentRoadFace,
                -bounds.min.y,
                position.z - bounds.center.z);
            instance.transform.position += boundsCorrection;

            bounds = renderers[0].bounds;
            foreach (Renderer renderer in renderers.Skip(1))
            {
                bounds.Encapsulate(renderer.bounds);
            }

            int slotCount = renderers.Sum(renderer => renderer.sharedMaterials.Length);
            return new BuildingInstance
            {
                GameObject = instance,
                Bounds = bounds,
                Record = new PlacementRecord
                {
                    name = name,
                    prefabPath = prefabPath,
                    position = instance.transform.position,
                    eulerAngles = new Vector3(0f, yaw, 0f),
                    scale = Vector3.one * uniformScale,
                    boundsCenter = bounds.center,
                    boundsSize = bounds.size,
                    rendererCount = renderers.Length,
                    materialSlotCount = slotCount
                }
            };
        }

        private static void CreateNeutralLighting()
        {
            RenderSettings.ambientMode = AmbientMode.Flat;
            RenderSettings.ambientLight = new Color(0.47f, 0.49f, 0.52f);
            RenderSettings.fog = false;

            GameObject lightObject = new GameObject("C99_Neutral_Directional_Light");
            Light light = lightObject.AddComponent<Light>();
            light.type = LightType.Directional;
            light.color = new Color(1f, 0.96f, 0.90f);
            light.intensity = 1.1f;
            light.shadows = LightShadows.Soft;
            lightObject.transform.rotation = Quaternion.Euler(48f, -32f, 0f);
        }

        private static Camera CreateCamera(string name, Vector3 position, Vector3 target, float fieldOfView)
        {
            GameObject cameraObject = new GameObject(name);
            Camera camera = cameraObject.AddComponent<Camera>();
            camera.transform.position = position;
            camera.transform.LookAt(target, Vector3.up);
            camera.fieldOfView = fieldOfView;
            camera.nearClipPlane = 0.1f;
            camera.farClipPlane = 250f;
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.54f, 0.60f, 0.66f);
            camera.allowHDR = false;
            camera.allowMSAA = true;
            return camera;
        }

        private static List<string> Validate(List<BuildingInstance> instances)
        {
            List<string> findings = new List<string>();
            int missingMaterialSlots = 0;
            int errorShaderSlots = 0;
            int missingScripts = 0;

            foreach (BuildingInstance instance in instances)
            {
                foreach (Transform transform in instance.GameObject.GetComponentsInChildren<Transform>(true))
                {
                    missingScripts += GameObjectUtility.GetMonoBehavioursWithMissingScriptCount(transform.gameObject);
                }

                foreach (Renderer renderer in instance.GameObject.GetComponentsInChildren<Renderer>(true))
                {
                    foreach (Material material in renderer.sharedMaterials)
                    {
                        if (material == null)
                        {
                            missingMaterialSlots++;
                            continue;
                        }

                        if (material.shader == null || material.shader.name.IndexOf("Error", StringComparison.OrdinalIgnoreCase) >= 0)
                        {
                            errorShaderSlots++;
                        }
                    }
                }
            }

            findings.Add("Missing scripts: " + missingScripts);
            findings.Add("Missing material slots: " + missingMaterialSlots);
            findings.Add("Error-shader material slots: " + errorShaderSlots);

            List<string> overlaps = new List<string>();
            for (int left = 0; left < instances.Count; left++)
            {
                for (int right = left + 1; right < instances.Count; right++)
                {
                    if (OverlapsBeyondTolerance(instances[left].Bounds, instances[right].Bounds, 0.02f))
                    {
                        overlaps.Add(instances[left].GameObject.name + " <-> " + instances[right].GameObject.name);
                    }
                }
            }
            findings.Add(overlaps.Count == 0 ? "Building bounds overlaps: 0" : "Building bounds overlaps: " + string.Join(", ", overlaps));

            string[] sidewalkIntrusions = instances
                .Where(instance => instance.GameObject.name.StartsWith("West", StringComparison.Ordinal) ? instance.Bounds.max.x > -8.28f : instance.Bounds.min.x < 8.28f)
                .Select(instance => instance.GameObject.name)
                .ToArray();
            findings.Add(sidewalkIntrusions.Length == 0
                ? "Public-front footprint check: no building bounds cross X +/-8.15 toward the sidewalks."
                : "Public-front footprint concerns: " + string.Join(", ", sidewalkIntrusions));

            string[] groundContactConcerns = instances
                .Where(instance => Mathf.Abs(instance.Bounds.min.y) > 0.02f)
                .Select(instance => instance.GameObject.name + "=" + instance.Bounds.min.y.ToString("F4"))
                .ToArray();
            findings.Add(groundContactConcerns.Length == 0
                ? "Ground contact: all building bounds minY within 0.02m of zero."
                : "Ground-contact concerns: " + string.Join(", ", groundContactConcerns));

            if (missingScripts != 0 || missingMaterialSlots != 0 || errorShaderSlots != 0 ||
                overlaps.Count != 0 || sidewalkIntrusions.Length != 0 || groundContactConcerns.Length != 0)
            {
                throw new InvalidOperationException("Assembly validation failed: " + string.Join(" | ", findings));
            }
            return findings;
        }

        private static bool OverlapsBeyondTolerance(Bounds left, Bounds right, float tolerance)
        {
            float overlapX = Mathf.Min(left.max.x, right.max.x) - Mathf.Max(left.min.x, right.min.x);
            float overlapY = Mathf.Min(left.max.y, right.max.y) - Mathf.Max(left.min.y, right.min.y);
            float overlapZ = Mathf.Min(left.max.z, right.max.z) - Mathf.Max(left.min.z, right.min.z);
            return overlapX > tolerance && overlapY > tolerance && overlapZ > tolerance;
        }

        private static CaptureRecord Capture(string captureName, Camera camera, string destinationDirectory = EvidenceDirectory)
        {
            RenderTexture renderTexture = new RenderTexture(CaptureWidth, CaptureHeight, 24, RenderTextureFormat.ARGB32);
            Texture2D texture = new Texture2D(CaptureWidth, CaptureHeight, TextureFormat.RGB24, false);
            RenderTexture previous = RenderTexture.active;
            try
            {
                camera.targetTexture = renderTexture;
                camera.Render();
                RenderTexture.active = renderTexture;
                texture.ReadPixels(new Rect(0, 0, CaptureWidth, CaptureHeight), 0, 0);
                texture.Apply(false, false);

                int magentaLikePixels = 0;
                int nonBackgroundPixels = 0;
                Color32[] pixels = texture.GetPixels32();
                Color32 background = pixels[0];
                HashSet<int> uniqueColors = new HashSet<int>();
                foreach (Color32 pixel in pixels)
                {
                    uniqueColors.Add((pixel.r << 16) | (pixel.g << 8) | pixel.b);
                    if (pixel.r > 220 && pixel.b > 220 && pixel.g < 70)
                    {
                        magentaLikePixels++;
                    }
                    if (Mathf.Abs(pixel.r - background.r) + Mathf.Abs(pixel.g - background.g) + Mathf.Abs(pixel.b - background.b) > 12)
                    {
                        nonBackgroundPixels++;
                    }
                }

                byte[] png = texture.EncodeToPNG();
                string assetPath = destinationDirectory + "/C99_VisualAssembly_" + captureName + ".png";
                File.WriteAllBytes(ToAbsolutePath(assetPath), png);
                return new CaptureRecord
                {
                    name = captureName,
                    path = assetPath,
                    sha256 = ComputeSha256(png),
                    magentaLikePixels = magentaLikePixels,
                    uniqueColorCount = uniqueColors.Count,
                    nonBackgroundPixels = nonBackgroundPixels
                };
            }
            finally
            {
                camera.targetTexture = null;
                RenderTexture.active = previous;
                UnityEngine.Object.DestroyImmediate(renderTexture);
                UnityEngine.Object.DestroyImmediate(texture);
            }
        }

        private static void ValidateCaptures(List<CaptureRecord> captures)
        {
            string[] blankCaptures = captures
                .Where(capture => capture.uniqueColorCount < 16 || capture.nonBackgroundPixels < 1000)
                .Select(capture => capture.name)
                .ToArray();
            if (blankCaptures.Length != 0)
            {
                throw new InvalidOperationException("Blank or geometry-free captures: " + string.Join(", ", blankCaptures));
            }

            if (captures.Select(capture => capture.sha256).Distinct(StringComparer.Ordinal).Count() != captures.Count)
            {
                throw new InvalidOperationException("Capture hashes are not all distinct.");
            }

            int magentaThreshold = CaptureWidth * CaptureHeight / 1000;
            string[] magentaCaptures = captures
                .Where(capture => capture.magentaLikePixels > magentaThreshold)
                .Select(capture => capture.name + "=" + capture.magentaLikePixels)
                .ToArray();
            if (magentaCaptures.Length != 0)
            {
                throw new InvalidOperationException("Magenta threshold exceeded: " + string.Join(", ", magentaCaptures));
            }
        }

        private static string ComputeSha256(byte[] bytes)
        {
            using (SHA256 sha = SHA256.Create())
            {
                return string.Concat(sha.ComputeHash(bytes).Select(value => value.ToString("X2")));
            }
        }
    }
}
