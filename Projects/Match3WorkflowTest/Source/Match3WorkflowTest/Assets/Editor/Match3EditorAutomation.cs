using System;
using System.Collections.Generic;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Match3WorkflowTest.Editor
{
    public static class Match3EditorAutomation
    {
        private const string ScenePath = "Assets/Scenes/Match3.unity";

        [InitializeOnLoadMethod]
        private static void ResumeVisiblePlayAfterReload()
        {
            bool requested = Array.Exists(
                Environment.GetCommandLineArgs(),
                argument => argument == "Match3WorkflowTest.Editor.Match3EditorAutomation.OpenAndPlay");

            if (Application.isBatchMode || !requested)
            {
                return;
            }

            EditorApplication.delayCall += () =>
            {
                if (EditorApplication.isPlayingOrWillChangePlaymode)
                {
                    return;
                }

                EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
                Debug.Log("MATCH3_VISIBLE_PLAY_RESUMED");
                EditorApplication.isPlaying = true;
            };
        }

        public static void CreateSceneAndRunTests()
        {
            RunLogicTests();
            CreateOrReplaceScene();
            Debug.Log("MATCH3_VALIDATION_PASSED");
        }

        public static void OpenAndPlay()
        {
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            EditorApplication.delayCall += () =>
            {
                Debug.Log("MATCH3_VISIBLE_PLAY_REQUESTED");
                EditorApplication.isPlaying = true;
            };
        }

        private static void CreateOrReplaceScene()
        {
            if (!AssetDatabase.IsValidFolder("Assets/Scenes"))
            {
                AssetDatabase.CreateFolder("Assets", "Scenes");
            }

            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            GameObject gameObject = new GameObject("Match3Game");
            gameObject.AddComponent<Match3Game>();
            EditorSceneManager.SaveScene(scene, ScenePath);
            EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };
            AssetDatabase.SaveAssets();
        }

        private static void RunLogicTests()
        {
            TestInitialBoard();
            TestHorizontalAndVerticalDetection();
            TestInvalidSwapRollback();
            TestValidSwapResolutionAndScore();
            TestRestart();
        }

        private static void TestInitialBoard()
        {
            Match3Board board = new Match3Board(1001);
            Require(board.FindMatches().Count == 0, "Initial board contains matches.");
            Require(board.Score == 0, "Initial score is not zero.");
            RequireAllCellsValid(board);
        }

        private static void TestHorizontalAndVerticalDetection()
        {
            Match3Board board = new Match3Board(1002);
            int[,] values = CreateStablePattern();
            values[0, 0] = 4;
            values[1, 0] = 4;
            values[2, 0] = 4;
            values[7, 4] = 3;
            values[7, 5] = 3;
            values[7, 6] = 3;
            board.LoadForTesting(values);
            HashSet<int> matches = board.FindMatches();
            Require(matches.Contains(0) && matches.Contains(1) && matches.Contains(2), "Horizontal match detection failed.");
            Require(matches.Contains(39) && matches.Contains(47) && matches.Contains(55), "Vertical match detection failed.");
        }

        private static void TestInvalidSwapRollback()
        {
            Match3Board board = new Match3Board(1003);
            int[,] values = CreateStablePattern();
            board.LoadForTesting(values);
            int first = board.GetStone(6, 6);
            int second = board.GetStone(7, 6);
            Require(!board.TrySwap(6, 6, 7, 6), "Invalid swap was accepted.");
            Require(board.GetStone(6, 6) == first && board.GetStone(7, 6) == second, "Invalid swap was not reverted.");
            Require(board.Score == 0, "Invalid swap changed the score.");
        }

        private static void TestValidSwapResolutionAndScore()
        {
            Match3Board board = new Match3Board(1004);
            int[,] values = CreateStablePattern();
            values[0, 0] = 0;
            values[1, 0] = 1;
            values[2, 0] = 0;
            values[1, 1] = 0;
            board.LoadForTesting(values);
            Require(board.FindMatches().Count == 0, "Valid-swap fixture starts with a match.");
            Require(board.TrySwap(1, 0, 1, 1), "Valid swap was rejected.");
            Require(board.Score >= 30, "Valid match did not increase score.");
            Require(board.FindMatches().Count == 0, "Matches remain after resolution.");
            RequireAllCellsValid(board);
        }

        private static void TestRestart()
        {
            Match3Board board = new Match3Board(1005);
            board.Restart();
            Require(board.Score == 0, "Restart did not reset score.");
            Require(board.FindMatches().Count == 0, "Restart produced an initial match.");
            RequireAllCellsValid(board);
        }

        private static int[,] CreateStablePattern()
        {
            int[,] values = new int[Match3Board.Width, Match3Board.Height];
            for (int y = 0; y < Match3Board.Height; y++)
            {
                for (int x = 0; x < Match3Board.Width; x++)
                {
                    values[x, y] = (x + y * 2) % Match3Board.StoneTypeCount;
                }
            }

            return values;
        }

        private static void RequireAllCellsValid(Match3Board board)
        {
            for (int y = 0; y < Match3Board.Height; y++)
            {
                for (int x = 0; x < Match3Board.Width; x++)
                {
                    int value = board.GetStone(x, y);
                    Require(value >= 0 && value < Match3Board.StoneTypeCount, "Board contains an invalid stone.");
                }
            }
        }

        private static void Require(bool condition, string message)
        {
            if (!condition)
            {
                throw new InvalidOperationException(message);
            }
        }
    }
}
