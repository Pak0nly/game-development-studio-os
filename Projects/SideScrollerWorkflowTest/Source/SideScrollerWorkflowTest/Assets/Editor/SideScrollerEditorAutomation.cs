using System;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace SideScrollerWorkflowTest.Editor
{
    public static class SideScrollerEditorAutomation
    {
        private const string ScenePath = "Assets/Scenes/SideScroller.unity";

        [InitializeOnLoadMethod]
        private static void ResumeVisiblePlayAfterReload()
        {
            bool requested = Array.Exists(Environment.GetCommandLineArgs(), argument => argument == "SideScrollerWorkflowTest.Editor.SideScrollerEditorAutomation.OpenAndPlay");
            if (Application.isBatchMode || !requested) return;
            EditorApplication.delayCall += () =>
            {
                if (EditorApplication.isPlayingOrWillChangePlaymode) return;
                EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
                Debug.Log("SIDESCROLLER_VISIBLE_PLAY_RESUMED");
                EditorApplication.isPlaying = true;
            };
        }

        public static void CreateSceneAndRunTests()
        {
            CreateOrReplaceScene();
            RunStructureTests();
            Debug.Log("SIDESCROLLER_VALIDATION_PASSED");
        }

        public static void OpenAndPlay()
        {
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            EditorApplication.delayCall += () =>
            {
                Debug.Log("SIDESCROLLER_VISIBLE_PLAY_REQUESTED");
                EditorApplication.isPlaying = true;
            };
        }

        private static void CreateOrReplaceScene()
        {
            if (!AssetDatabase.IsValidFolder("Assets/Scenes")) AssetDatabase.CreateFolder("Assets", "Scenes");
            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            new GameObject("SideScrollerGame").AddComponent<SideScrollerGame>();
            EditorSceneManager.SaveScene(scene, ScenePath);
            EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };
            AssetDatabase.SaveAssets();
        }

        private static void RunStructureTests()
        {
            SideScrollerGame game = UnityEngine.Object.FindFirstObjectByType<SideScrollerGame>();
            Require(game != null, "Scene bootstrap is missing.");
            game.BuildLevel();
            Require(GameObject.Find("Player")?.GetComponent<PlayerController>() != null, "Player controller is missing.");
            Require(GameObject.Find("Side Camera")?.GetComponent<CameraFollow>() != null, "Following camera is missing.");
            Require(GameObject.Find("Moving Platform")?.GetComponent<MovingPlatform>() != null, "Moving platform is missing.");
            Require(GameObject.Find("Moving Obstacle")?.GetComponent<MovingObstacle>() != null, "Moving obstacle is missing.");
            Require(GameObject.Find("Goal Trigger")?.GetComponent<GoalTrigger>() != null, "Goal trigger is missing.");
            Require(GameObject.Find("Landing Dust")?.GetComponent<ParticleSystem>() != null, "Landing VFX is missing.");
            Require(GameObject.Find("Goal Particles")?.GetComponent<ParticleSystem>() != null, "Goal VFX is missing.");
            Require(SideScrollerGame.FallResetHeight < -5f, "Fall reset threshold is unsafe.");
        }

        private static void Require(bool condition, string message)
        {
            if (!condition) throw new InvalidOperationException(message);
        }
    }
}
