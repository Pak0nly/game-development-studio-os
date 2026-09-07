using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

public static class HvdtPreparedPreviewGenerator
{
    private const int Width = 960;
    private const int Height = 540;

    [Serializable]
    private sealed class PreviewRecord
    {
        public string previewId;
        public string fileName;
        public string context;
        public string materialPath;
        public int width;
        public int height;
        public long byteSize;
        public string sha256;
        public int uniqueColorCount;
        public int magentaPixels;
    }

    [Serializable]
    private sealed class PreviewManifest
    {
        public string schemaVersion = "1.0";
        public string generator = "HvdtPreparedPreviewGenerator";
        public int width = Width;
        public int height = Height;
        public List<PreviewRecord> previews = new List<PreviewRecord>();
    }

    private sealed class PreviewSpec
    {
        public string Id;
        public string FileName;
        public string Context;
        public string MaterialPath;
        public bool VisibleState;

        public PreviewSpec(
            string id,
            string fileName,
            string context,
            string materialPath = "",
            bool visibleState = true)
        {
            Id = id;
            FileName = fileName;
            Context = context;
            MaterialPath = materialPath;
            VisibleState = visibleState;
        }
    }

    private static readonly PreviewSpec[] Specs =
    {
        new PreviewSpec(
            "road-new-asphalt-context",
            "road-new-asphalt-context.png",
            "road",
            "Assets/ThirdParty/1950sNYC/LeartesStudios/NYC1950s/Art/Materials/M_NewAsphalt01.mat"),
        new PreviewSpec(
            "road-new-asphalt-light-context",
            "road-new-asphalt-light-context.png",
            "road",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/M_NewAsphalt01_Light.mat"),
        new PreviewSpec(
            "pavement-new-pavement-context",
            "pavement-new-pavement-context.png",
            "sidewalk",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/M_NewPavement01_Inst.mat"),
        new PreviewSpec(
            "pavement-pavemat-context",
            "pavement-pavemat-context.png",
            "sidewalk",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/M_PaveMat01.mat"),
        new PreviewSpec(
            "curb-new-pavement-context",
            "curb-new-pavement-context.png",
            "curb",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/M_NewPavement01_Inst.mat"),
        new PreviewSpec(
            "curb-pavemat-context",
            "curb-pavemat-context.png",
            "curb",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/M_PaveMat01.mat"),
        new PreviewSpec(
            "curb-nycb9-concrete-context",
            "curb-nycb9-concrete-context.png",
            "curb",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/Building/M_NYCB9_Concrete_03.mat"),
        new PreviewSpec(
            "service-new-asphalt-context",
            "service-new-asphalt-context.png",
            "service",
            "Assets/ThirdParty/1950sNYC/LeartesStudios/NYC1950s/Art/Materials/M_NewAsphalt01.mat"),
        new PreviewSpec(
            "service-new-asphalt-light-context",
            "service-new-asphalt-light-context.png",
            "service",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/M_NewAsphalt01_Light.mat"),
        new PreviewSpec(
            "service-new-pavement-context",
            "service-new-pavement-context.png",
            "service",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/M_NewPavement01_Inst.mat"),
        new PreviewSpec(
            "service-pavemat-context",
            "service-pavemat-context.png",
            "service",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/M_PaveMat01.mat"),
        new PreviewSpec(
            "ground-infill-retain-context",
            "ground-infill-retain-context.png",
            "ground-beneath-buildings",
            visibleState: true),
        new PreviewSpec(
            "ground-infill-remove-context",
            "ground-infill-remove-context.png",
            "ground-beneath-buildings",
            visibleState: false),
        new PreviewSpec(
            "repair-asphalt03-context",
            "repair-asphalt03-context.png",
            "repair-material",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/Decals/M_Asphalt03.mat"),
        new PreviewSpec(
            "repair-concrete06-context",
            "repair-concrete06-context.png",
            "repair-material",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/Decals/M_Concrete06.mat"),
        new PreviewSpec(
            "repair-concrete07-context",
            "repair-concrete07-context.png",
            "repair-material",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/Decals/M_Concrete07.mat"),
        new PreviewSpec(
            "repair-concrete011-context",
            "repair-concrete011-context.png",
            "repair-material",
            "Assets/LeartesStudios/NYC1950s/HDRP/Art/Materials/Decals/M_Concrete011.mat"),
        new PreviewSpec(
            "rectangular-repair-existing-context",
            "rectangular-repair-existing-context.png",
            "rectangular-repair",
            visibleState: true),
        new PreviewSpec(
            "rectangular-repair-hidden-context",
            "rectangular-repair-hidden-context.png",
            "rectangular-repair",
            visibleState: false),
        new PreviewSpec(
            "ground-infill-existing-context",
            "ground-infill-existing-context.png",
            "ground-infill-geometry",
            visibleState: true),
        new PreviewSpec(
            "ground-infill-hidden-context",
            "ground-infill-hidden-context.png",
            "ground-infill-geometry",
            visibleState: false),
    };

    public static void Run()
    {
        try
        {
            string outputRoot = Environment.GetEnvironmentVariable("HVDT_PREVIEW_OUTPUT");
            if (string.IsNullOrWhiteSpace(outputRoot))
            {
                throw new InvalidOperationException("HVDT_PREVIEW_OUTPUT is required.");
            }

            outputRoot = Path.GetFullPath(outputRoot);
            Directory.CreateDirectory(outputRoot);
            var manifest = new PreviewManifest();

            foreach (PreviewSpec spec in Specs)
            {
                EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
                ConfigureEnvironment();
                BuildContext(spec);
                PreviewRecord record = Capture(spec, outputRoot);
                manifest.previews.Add(record);
                Debug.Log(
                    "HVDT_PREVIEW_OK " + record.previewId +
                    " " + record.width + "x" + record.height +
                    " bytes=" + record.byteSize +
                    " sha256=" + record.sha256 +
                    " uniqueColors=" + record.uniqueColorCount +
                    " magentaPixels=" + record.magentaPixels);
            }

            string manifestPath = Path.Combine(outputRoot, "prepared-preview-manifest.json");
            File.WriteAllText(manifestPath, JsonUtility.ToJson(manifest, true));
            Debug.Log("HVDT_PREVIEW_MANIFEST " + manifestPath);
            EditorApplication.Exit(0);
        }
        catch (Exception exception)
        {
            Debug.LogException(exception);
            EditorApplication.Exit(1);
        }
    }

    private static void ConfigureEnvironment()
    {
        RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Flat;
        RenderSettings.ambientLight = new Color(0.32f, 0.34f, 0.38f, 1f);
        RenderSettings.fog = false;
        RenderSettings.skybox = null;

        var key = new GameObject("Fixed Key Light");
        var keyLight = key.AddComponent<Light>();
        keyLight.type = LightType.Directional;
        keyLight.intensity = 1.15f;
        keyLight.color = new Color(1f, 0.96f, 0.9f, 1f);
        key.transform.rotation = Quaternion.Euler(48f, -32f, 0f);

        var fill = new GameObject("Fixed Fill Light");
        var fillLight = fill.AddComponent<Light>();
        fillLight.type = LightType.Directional;
        fillLight.intensity = 0.45f;
        fillLight.color = new Color(0.72f, 0.82f, 1f, 1f);
        fill.transform.rotation = Quaternion.Euler(62f, 148f, 0f);
    }

    private static void BuildContext(PreviewSpec spec)
    {
        if (!string.IsNullOrEmpty(spec.MaterialPath))
        {
            Material material = AssetDatabase.LoadAssetAtPath<Material>(spec.MaterialPath);
            if (material == null)
            {
                throw new InvalidOperationException(
                    "Material could not be loaded: " + spec.MaterialPath);
            }
            if (material.shader == null ||
                material.shader.name == "Hidden/InternalErrorShader")
            {
                throw new InvalidOperationException(
                    "Material shader is unavailable: " + spec.MaterialPath);
            }
            if (spec.Context == "repair-material")
            {
                material = CreateRepairPreviewMaterial(material);
            }
            BuildMaterialContext(spec.Context, material);
            return;
        }

        BuildGeometryContext(spec.Context, spec.VisibleState);
    }

    private static void BuildMaterialContext(string context, Material material)
    {
        Material neutralDark = CreateSolidMaterial(new Color(0.16f, 0.17f, 0.19f, 1f));
        Material neutralLight = CreateSolidMaterial(new Color(0.48f, 0.5f, 0.53f, 1f));

        if (context == "curb")
        {
            CreateBox("Road Context", new Vector3(0f, -0.16f, 0f), new Vector3(8f, 0.22f, 4.8f), neutralDark);
            CreateBox("Curb Preview", new Vector3(0f, 0.08f, 0.35f), new Vector3(7.2f, 0.34f, 0.52f), material);
            CreateBox("Pavement Context", new Vector3(0f, 0.02f, 1.65f), new Vector3(8f, 0.18f, 2.0f), neutralLight);
            return;
        }

        if (context == "repair-material")
        {
            CreateBox("Road Context", new Vector3(0f, -0.16f, 0f), new Vector3(8f, 0.22f, 5f), neutralDark);
            CreateBox("Repair Material Preview", new Vector3(0f, 0.01f, 0f), new Vector3(4.8f, 0.08f, 2.4f), material);
            return;
        }

        Vector3 scale = context == "road"
            ? new Vector3(8f, 0.18f, 4.8f)
            : context == "sidewalk"
                ? new Vector3(7.2f, 0.22f, 4.2f)
                : new Vector3(6.8f, 0.2f, 5.4f);
        CreateBox("Material Preview Surface", Vector3.zero, scale, material);
        CreateBox("Fixed Context Edge", new Vector3(0f, -0.05f, 2.55f), new Vector3(8.4f, 0.3f, 0.35f), neutralLight);
    }

    private static void BuildGeometryContext(string context, bool visibleState)
    {
        Material ground = CreateSolidMaterial(new Color(0.23f, 0.25f, 0.27f, 1f));
        Material building = CreateSolidMaterial(new Color(0.55f, 0.53f, 0.49f, 1f));
        Material subject = CreateSolidMaterial(new Color(0.72f, 0.52f, 0.24f, 1f));

        CreateBox("Fixed Ground", new Vector3(0f, -0.18f, 0f), new Vector3(8f, 0.2f, 5f), ground);

        if (context == "rectangular-repair")
        {
            if (visibleState)
            {
                CreateBox("Repair Rectangle A", new Vector3(-1.55f, 0f, -0.5f), new Vector3(2.0f, 0.08f, 1.15f), subject);
                CreateBox("Repair Rectangle B", new Vector3(1.2f, 0f, 0.65f), new Vector3(2.65f, 0.08f, 1.05f), subject);
            }
            return;
        }

        CreateBox("Building Context Left", new Vector3(-2.75f, 1.0f, 1.25f), new Vector3(2.0f, 2.2f, 1.8f), building);
        CreateBox("Building Context Right", new Vector3(2.75f, 1.0f, 1.25f), new Vector3(2.0f, 2.2f, 1.8f), building);
        if (visibleState)
        {
            string name = context == "ground-infill-geometry"
                ? "Ground Infill Existing"
                : "Ground Beneath Buildings Existing";
            CreateBox(name, new Vector3(0f, -0.01f, 1.15f), new Vector3(3.4f, 0.1f, 1.65f), subject);
        }
    }

    private static PreviewRecord Capture(PreviewSpec spec, string outputRoot)
    {
        var cameraObject = new GameObject("Fixed Preview Camera");
        var camera = cameraObject.AddComponent<Camera>();
        camera.clearFlags = CameraClearFlags.SolidColor;
        camera.backgroundColor = new Color(0.075f, 0.082f, 0.095f, 1f);
        camera.fieldOfView = 34f;
        camera.nearClipPlane = 0.1f;
        camera.farClipPlane = 100f;
        camera.transform.position = new Vector3(6.8f, 5.5f, -7.8f);
        camera.transform.rotation = LookRotation(camera.transform.position, new Vector3(0f, 0.2f, 0.35f));

        var renderTexture = new RenderTexture(Width, Height, 24, RenderTextureFormat.ARGB32)
        {
            antiAliasing = 1,
            filterMode = FilterMode.Bilinear,
            wrapMode = TextureWrapMode.Clamp,
        };
        var texture = new Texture2D(Width, Height, TextureFormat.RGBA32, false, false);
        RenderTexture previous = RenderTexture.active;
        try
        {
            camera.targetTexture = renderTexture;
            camera.Render();
            RenderTexture.active = renderTexture;
            texture.ReadPixels(new Rect(0, 0, Width, Height), 0, 0);
            texture.Apply(false, false);

            Color32[] pixels = texture.GetPixels32();
            int magentaPixels = pixels.Count(
                pixel => pixel.r >= 245 && pixel.g <= 10 && pixel.b >= 245);
            int uniqueColors = new HashSet<uint>(
                pixels.Select(
                    pixel =>
                        ((uint)pixel.r << 24) |
                        ((uint)pixel.g << 16) |
                        ((uint)pixel.b << 8) |
                        pixel.a)).Count;
            if (uniqueColors < 32)
            {
                throw new InvalidOperationException(
                    spec.Id + " render is unexpectedly uniform.");
            }
            if (magentaPixels > pixels.Length / 20)
            {
                throw new InvalidOperationException(
                    spec.Id + " render contains excessive error-shader pixels.");
            }

            byte[] png = texture.EncodeToPNG();
            if (png.Length < 4096)
            {
                throw new InvalidOperationException(
                    spec.Id + " render output is unexpectedly small.");
            }
            string outputPath = Path.Combine(outputRoot, spec.FileName);
            File.WriteAllBytes(outputPath, png);

            return new PreviewRecord
            {
                previewId = spec.Id,
                fileName = spec.FileName,
                context = spec.Context,
                materialPath = spec.MaterialPath,
                width = Width,
                height = Height,
                byteSize = png.LongLength,
                sha256 = HashBytes(png),
                uniqueColorCount = uniqueColors,
                magentaPixels = magentaPixels,
            };
        }
        finally
        {
            camera.targetTexture = null;
            RenderTexture.active = previous;
            renderTexture.Release();
            UnityEngine.Object.DestroyImmediate(renderTexture);
            UnityEngine.Object.DestroyImmediate(texture);
        }
    }

    private static GameObject CreateBox(
        string name,
        Vector3 position,
        Vector3 scale,
        Material material)
    {
        GameObject instance = GameObject.CreatePrimitive(PrimitiveType.Cube);
        instance.name = name;
        instance.transform.position = position;
        instance.transform.localScale = scale;
        instance.GetComponent<Renderer>().sharedMaterial = material;
        UnityEngine.Object.DestroyImmediate(instance.GetComponent<Collider>());
        return instance;
    }

    private static Material CreateSolidMaterial(Color color)
    {
        Shader shader = Shader.Find("Universal Render Pipeline/Lit") ??
                        Shader.Find("Standard");
        if (shader == null)
        {
            throw new InvalidOperationException("No supported local preview shader found.");
        }
        var material = new Material(shader)
        {
            color = color,
            hideFlags = HideFlags.HideAndDontSave,
        };
        if (material.HasProperty("_BaseColor"))
        {
            material.SetColor("_BaseColor", color);
        }
        return material;
    }

    private static Material CreateRepairPreviewMaterial(Material source)
    {
        Shader shader = Shader.Find("Universal Render Pipeline/Lit") ??
                        Shader.Find("Standard");
        if (shader == null)
        {
            throw new InvalidOperationException(
                "No supported local repair-preview shader found.");
        }

        var preview = new Material(shader)
        {
            hideFlags = HideFlags.HideAndDontSave,
        };

        Texture baseTexture = FindTextureByDescription(
            source,
            new[] { "BaseColor", "Base" });
        if (baseTexture == null)
        {
            throw new InvalidOperationException(
                "Repair material has no audited base texture: " +
                AssetDatabase.GetAssetPath(source));
        }

        Color baseColor = FindColorByDescription(
            source,
            new[] { "Color", "BaseColor" },
            Color.white);
        baseColor.a = 1f;
        float roughness = Mathf.Clamp01(
            FindFloatByDescription(source, "Roughness", 0.5f));
        float metallic = Mathf.Clamp01(
            FindFloatByDescription(source, "Metallic", 0f));

        if (preview.HasProperty("_BaseMap"))
        {
            preview.SetTexture("_BaseMap", baseTexture);
            preview.SetTextureScale("_BaseMap", Vector2.one);
            preview.SetTextureOffset("_BaseMap", Vector2.zero);
        }
        if (preview.HasProperty("_MainTex"))
        {
            preview.SetTexture("_MainTex", baseTexture);
        }
        if (preview.HasProperty("_BaseColor"))
        {
            preview.SetColor("_BaseColor", baseColor);
        }
        preview.color = baseColor;
        if (preview.HasProperty("_Metallic"))
        {
            preview.SetFloat("_Metallic", metallic);
        }
        if (preview.HasProperty("_Smoothness"))
        {
            preview.SetFloat("_Smoothness", 1f - roughness);
        }
        if (preview.HasProperty("_Glossiness"))
        {
            preview.SetFloat("_Glossiness", 1f - roughness);
        }
        return preview;
    }

    private static Texture FindTextureByDescription(
        Material material,
        IEnumerable<string> descriptions)
    {
        var accepted = new HashSet<string>(
            descriptions,
            StringComparer.OrdinalIgnoreCase);
        int count = ShaderUtil.GetPropertyCount(material.shader);
        for (int index = 0; index < count; index++)
        {
            if (ShaderUtil.GetPropertyType(material.shader, index) !=
                ShaderUtil.ShaderPropertyType.TexEnv)
            {
                continue;
            }
            string description =
                ShaderUtil.GetPropertyDescription(material.shader, index);
            if (!accepted.Contains(description))
            {
                continue;
            }
            Texture texture = material.GetTexture(
                ShaderUtil.GetPropertyName(material.shader, index));
            if (texture != null)
            {
                return texture;
            }
        }
        return null;
    }

    private static Color FindColorByDescription(
        Material material,
        IEnumerable<string> descriptions,
        Color fallback)
    {
        var accepted = new HashSet<string>(
            descriptions,
            StringComparer.OrdinalIgnoreCase);
        int count = ShaderUtil.GetPropertyCount(material.shader);
        for (int index = 0; index < count; index++)
        {
            if (ShaderUtil.GetPropertyType(material.shader, index) !=
                ShaderUtil.ShaderPropertyType.Color ||
                !accepted.Contains(
                    ShaderUtil.GetPropertyDescription(material.shader, index)))
            {
                continue;
            }
            return material.GetColor(
                ShaderUtil.GetPropertyName(material.shader, index));
        }
        return fallback;
    }

    private static float FindFloatByDescription(
        Material material,
        string description,
        float fallback)
    {
        int count = ShaderUtil.GetPropertyCount(material.shader);
        for (int index = 0; index < count; index++)
        {
            ShaderUtil.ShaderPropertyType type =
                ShaderUtil.GetPropertyType(material.shader, index);
            if ((type != ShaderUtil.ShaderPropertyType.Float &&
                 type != ShaderUtil.ShaderPropertyType.Range) ||
                !string.Equals(
                    ShaderUtil.GetPropertyDescription(material.shader, index),
                    description,
                    StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }
            return material.GetFloat(
                ShaderUtil.GetPropertyName(material.shader, index));
        }
        return fallback;
    }

    private static Quaternion LookRotation(Vector3 cameraPosition, Vector3 target)
    {
        return Quaternion.LookRotation((target - cameraPosition).normalized, Vector3.up);
    }

    private static string HashBytes(byte[] bytes)
    {
        using (SHA256 sha = SHA256.Create())
        {
            return BitConverter.ToString(sha.ComputeHash(bytes)).Replace("-", "");
        }
    }
}
