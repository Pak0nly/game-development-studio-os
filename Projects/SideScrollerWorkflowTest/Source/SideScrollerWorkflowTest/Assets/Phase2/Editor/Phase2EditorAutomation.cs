using System;
using UnityEditor;
using UnityEngine;

namespace SideScrollerWorkflowTest.Phase2.Editor
{
    public static class Phase2EditorAutomation
    {
        private const string TextureRoot = "Assets/Phase2/Textures/";
        private const string MaterialFolder = "Assets/Resources/Phase2Materials";

        public static void ConfigureAndValidate()
        {
            EnsureFolder("Assets/Resources");
            EnsureFolder(MaterialFolder);

            Texture2D ground = ConfigureTexture("T_Ground_Stone.png", 512, TextureWrapMode.Repeat);
            Texture2D raised = ConfigureTexture("T_Platform_Raised.png", 512, TextureWrapMode.Repeat);
            Texture2D moving = ConfigureTexture("T_MovingPlatform_Stripes.png", 256, TextureWrapMode.Repeat);
            Texture2D obstacle = ConfigureTexture("T_Obstacle_Chevrons.png", 256, TextureWrapMode.Repeat);
            Texture2D background = ConfigureTexture("T_Background_Ruins.png", 1024, TextureWrapMode.Clamp);

            CreateOrUpdateMaterial("M_Ground_Stone", ground, new Color(0.12f, 0.36f, 0.58f), new Vector2(2f, 2f));
            CreateOrUpdateMaterial("M_Platform_Raised", raised, new Color(0.12f, 0.62f, 0.66f), new Vector2(2f, 2f));
            CreateOrUpdateMaterial("M_MovingPlatform_Stripes", moving, new Color(0.95f, 0.72f, 0.10f), new Vector2(2f, 1f));
            CreateOrUpdateMaterial("M_Obstacle_Chevrons", obstacle, new Color(0.95f, 0.30f, 0.08f), new Vector2(1f, 2f));
            CreateOrUpdateMaterial("M_Background_Ruins", background, Color.white, Vector2.one);

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            ValidateAssets();
            Debug.Log("SIDESCROLLER_PHASE2_ASSET_VALIDATION_PASSED");
        }

        private static Texture2D ConfigureTexture(string fileName, int maxSize, TextureWrapMode wrapMode)
        {
            string path = TextureRoot + fileName;
            TextureImporter importer = AssetImporter.GetAtPath(path) as TextureImporter;
            Require(importer != null, "Texture importer missing: " + path);
            importer.textureType = TextureImporterType.Default;
            importer.sRGBTexture = true;
            importer.mipmapEnabled = true;
            importer.wrapMode = wrapMode;
            importer.filterMode = FilterMode.Bilinear;
            importer.anisoLevel = 2;
            importer.maxTextureSize = maxSize;
            importer.textureCompression = TextureImporterCompression.Compressed;
            importer.SaveAndReimport();
            Texture2D texture = AssetDatabase.LoadAssetAtPath<Texture2D>(path);
            Require(texture != null, "Texture asset missing after import: " + path);
            return texture;
        }

        private static void CreateOrUpdateMaterial(string name, Texture2D texture, Color tint, Vector2 tiling)
        {
            string path = MaterialFolder + "/" + name + ".mat";
            Material material = AssetDatabase.LoadAssetAtPath<Material>(path);
            if (material == null)
            {
                material = new Material(Shader.Find("Standard")) { name = name };
                AssetDatabase.CreateAsset(material, path);
            }

            material.shader = Shader.Find("Standard");
            material.mainTexture = texture;
            material.mainTextureScale = tiling;
            material.color = tint;
            material.SetFloat("_Metallic", 0f);
            material.SetFloat("_Glossiness", 0.22f);
            EditorUtility.SetDirty(material);
        }

        private static void ValidateAssets()
        {
            string[] textureNames = { "T_Ground_Stone", "T_Platform_Raised", "T_MovingPlatform_Stripes", "T_Obstacle_Chevrons", "T_Background_Ruins" };
            foreach (string textureName in textureNames)
            {
                Require(AssetDatabase.LoadAssetAtPath<Texture2D>(TextureRoot + textureName + ".png") != null, "Missing Phase 2 texture: " + textureName);
            }

            string[] materialNames = { "M_Ground_Stone", "M_Platform_Raised", "M_MovingPlatform_Stripes", "M_Obstacle_Chevrons", "M_Background_Ruins" };
            foreach (string materialName in materialNames)
            {
                Material material = AssetDatabase.LoadAssetAtPath<Material>(MaterialFolder + "/" + materialName + ".mat");
                Require(material != null && material.shader.name == "Standard" && material.mainTexture != null, "Invalid Phase 2 material: " + materialName);
            }
        }

        private static void EnsureFolder(string path)
        {
            if (AssetDatabase.IsValidFolder(path)) return;
            int separator = path.LastIndexOf('/');
            string parent = path.Substring(0, separator);
            string name = path.Substring(separator + 1);
            EnsureFolder(parent);
            AssetDatabase.CreateFolder(parent, name);
        }

        private static void Require(bool condition, string message)
        {
            if (!condition) throw new InvalidOperationException(message);
        }
    }
}
