using UnityEngine;

namespace SideScrollerWorkflowTest
{
    public sealed class SideScrollerGame : MonoBehaviour
    {
        public static readonly Vector3 StartPosition = new Vector3(-18f, 1.5f, 0f);
        public const float FallResetHeight = -8f;

        private PlayerController player;
        private GUIStyle titleStyle;
        private GUIStyle instructionStyle;
        private GUIStyle successStyle;

        public bool HasFinished { get; private set; }

        private void Awake()
        {
            BuildLevel();
        }

        private void Start()
        {
            Debug.Log("SIDESCROLLER_PLAY_MODE_STARTED");
        }

        private void Update()
        {
            if (!HasFinished && player != null && player.transform.position.y < FallResetHeight)
            {
                player.ResetTo(StartPosition);
                Debug.Log("SIDESCROLLER_PLAYER_RESET");
            }
        }

        private void OnGUI()
        {
            EnsureStyles();
            GUI.Label(new Rect(20f, 16f, Screen.width - 40f, 40f), "SIDE-SCROLLER WORKFLOW TEST", titleStyle);
            GUI.Label(new Rect(20f, 58f, Screen.width - 40f, 28f), "Move: A/D or Arrow Keys    Jump: Space", instructionStyle);

            if (HasFinished)
            {
                GUI.Box(new Rect(Screen.width * 0.5f - 220f, Screen.height * 0.5f - 70f, 440f, 140f), GUIContent.none);
                GUI.Label(new Rect(Screen.width * 0.5f - 200f, Screen.height * 0.5f - 45f, 400f, 90f), "GOAL REACHED!\nWorkflow test complete.", successStyle);
            }
        }

        public void BuildLevel()
        {
            if (transform.Find("RuntimeLevel") != null)
            {
                return;
            }

            Transform level = new GameObject("RuntimeLevel").transform;
            level.SetParent(transform);

            Material ground = CreateMaterial("Ground Blue", new Color(0.12f, 0.36f, 0.58f));
            Material raised = CreateMaterial("Raised Cyan", new Color(0.12f, 0.62f, 0.66f));
            Material hazard = CreateMaterial("Hazard Orange", new Color(0.95f, 0.30f, 0.08f));
            Material moving = CreateMaterial("Moving Yellow", new Color(0.95f, 0.72f, 0.10f));
            Material goal = CreateMaterial("Goal Green", new Color(0.18f, 0.85f, 0.30f));

            CreateBlock(level, "Start Platform", new Vector3(-18f, 0f, 0f), new Vector3(7f, 1f, 5f), ground);
            CreateBlock(level, "Low Platform", new Vector3(-10.5f, -1.2f, 0f), new Vector3(5f, 1f, 5f), ground);
            CreateBlock(level, "Step One", new Vector3(-5.5f, 0.2f, 0f), new Vector3(3f, 1f, 5f), raised);
            CreateBlock(level, "Step Two", new Vector3(-1.5f, 1.5f, 0f), new Vector3(3f, 1f, 5f), raised);
            CreateBlock(level, "Middle Platform", new Vector3(3f, 0f, 0f), new Vector3(4f, 1f, 5f), ground);
            CreateBlock(level, "Obstacle Platform", new Vector3(10f, 0.2f, 0f), new Vector3(8f, 1f, 5f), ground);
            CreateBlock(level, "Final Step", new Vector3(16f, 1.4f, 0f), new Vector3(3f, 1f, 5f), raised);
            CreateBlock(level, "Goal Platform", new Vector3(21f, 2.5f, 0f), new Vector3(6f, 1f, 5f), goal);

            GameObject movingPlatform = CreateBlock(level, "Moving Platform", new Vector3(6f, -0.2f, 0f), new Vector3(3f, 0.6f, 4f), moving);
            MovingPlatform platformMotion = movingPlatform.AddComponent<MovingPlatform>();
            platformMotion.Configure(new Vector3(6f, -0.2f, 0f), new Vector3(6f, 2.2f, 0f), 1.25f);

            GameObject obstacle = CreateBlock(level, "Moving Obstacle", new Vector3(10f, 1.55f, 0f), new Vector3(1.4f, 1.7f, 4f), hazard);
            obstacle.GetComponent<BoxCollider>().isTrigger = true;
            MovingObstacle obstacleMotion = obstacle.AddComponent<MovingObstacle>();
            obstacleMotion.Configure(new Vector3(8f, 1.55f, 0f), new Vector3(12f, 1.55f, 0f), 2.2f);

            CreateStartMarker(level, goal);
            CreateGoal(level, goal);
            CreateLighting(level);
            CreatePlayer(level);
            CreateCamera(level);
        }

        public void CompleteLevel()
        {
            if (HasFinished)
            {
                return;
            }

            HasFinished = true;
            player.SetFinished();
            Debug.Log("SIDESCROLLER_GOAL_REACHED");
        }

        private void CreatePlayer(Transform parent)
        {
            GameObject root = new GameObject("Player");
            root.transform.SetParent(parent);
            root.transform.position = StartPosition;
            CapsuleCollider collider = root.AddComponent<CapsuleCollider>();
            collider.height = 2f;
            collider.radius = 0.48f;
            Rigidbody body = root.AddComponent<Rigidbody>();
            body.mass = 1.2f;
            body.constraints = RigidbodyConstraints.FreezePositionZ | RigidbodyConstraints.FreezeRotation;
            body.interpolation = RigidbodyInterpolation.Interpolate;
            body.collisionDetectionMode = CollisionDetectionMode.Continuous;

            GameObject visual = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            visual.name = "Player Visual";
            visual.transform.SetParent(root.transform, false);
            RemoveComponent(visual.GetComponent<Collider>());
            visual.GetComponent<Renderer>().material = CreateMaterial("Player White", new Color(0.92f, 0.94f, 1f));

            GameObject face = GameObject.CreatePrimitive(PrimitiveType.Cube);
            face.name = "Facing Marker";
            face.transform.SetParent(root.transform, false);
            face.transform.localPosition = new Vector3(0.37f, 0.25f, -0.1f);
            face.transform.localScale = new Vector3(0.18f, 0.28f, 0.65f);
            RemoveComponent(face.GetComponent<Collider>());
            face.GetComponent<Renderer>().material = CreateMaterial("Player Accent", new Color(0.15f, 0.25f, 0.48f));

            ParticleSystem dust = CreateDust(root.transform);
            player = root.AddComponent<PlayerController>();
            player.Configure(body, dust, StartPosition);
        }

        private void CreateCamera(Transform parent)
        {
            GameObject cameraObject = new GameObject("Side Camera");
            cameraObject.transform.SetParent(parent);
            cameraObject.transform.position = StartPosition + new Vector3(3f, 4f, -14f);
            Camera camera = cameraObject.AddComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.07f, 0.11f, 0.18f);
            camera.fieldOfView = 52f;
            cameraObject.AddComponent<AudioListener>();
            CameraFollow follow = cameraObject.AddComponent<CameraFollow>();
            follow.Configure(player.transform, new Vector3(3f, 3.6f, -14f));
        }

        private void CreateGoal(Transform parent, Material material)
        {
            GameObject leftPost = CreateBlock(parent, "Goal Left Post", new Vector3(20f, 4.25f, 0f), new Vector3(0.35f, 3f, 3.8f), material);
            GameObject rightPost = CreateBlock(parent, "Goal Right Post", new Vector3(22f, 4.25f, 0f), new Vector3(0.35f, 3f, 3.8f), material);
            CreateBlock(parent, "Goal Header", new Vector3(21f, 5.65f, 0f), new Vector3(2.35f, 0.3f, 3.8f), material);
            leftPost.GetComponent<Collider>().enabled = false;
            rightPost.GetComponent<Collider>().enabled = false;

            GameObject trigger = new GameObject("Goal Trigger");
            trigger.transform.SetParent(parent);
            trigger.transform.position = new Vector3(21f, 4f, 0f);
            BoxCollider collider = trigger.AddComponent<BoxCollider>();
            collider.size = new Vector3(1.4f, 3f, 4f);
            collider.isTrigger = true;
            GoalTrigger goalTrigger = trigger.AddComponent<GoalTrigger>();
            goalTrigger.Configure(this);

            ParticleSystem particles = CreateGoalParticles(trigger.transform);
            particles.Play();
        }

        private void CreateStartMarker(Transform parent, Material material)
        {
            GameObject marker = CreateBlock(parent, "Start Marker", new Vector3(-20.5f, 1.6f, 0f), new Vector3(0.35f, 2.2f, 3.5f), material);
            marker.GetComponent<Collider>().enabled = false;
        }

        private static void CreateLighting(Transform parent)
        {
            GameObject lightObject = new GameObject("Directional Light");
            lightObject.transform.SetParent(parent);
            lightObject.transform.rotation = Quaternion.Euler(45f, -35f, 0f);
            Light light = lightObject.AddComponent<Light>();
            light.type = LightType.Directional;
            light.intensity = 1.25f;
            light.shadows = LightShadows.Soft;
        }

        private static GameObject CreateBlock(Transform parent, string name, Vector3 position, Vector3 scale, Material material)
        {
            GameObject block = GameObject.CreatePrimitive(PrimitiveType.Cube);
            block.name = name;
            block.transform.SetParent(parent);
            block.transform.position = position;
            block.transform.localScale = scale;
            block.GetComponent<Renderer>().material = material;
            return block;
        }

        private static Material CreateMaterial(string name, Color color)
        {
            Shader shader = Shader.Find("Standard");
            Material material = new Material(shader) { name = name, color = color };
            return material;
        }

        private static void RemoveComponent(Component component)
        {
            if (Application.isPlaying)
            {
                Destroy(component);
            }
            else
            {
                DestroyImmediate(component);
            }
        }

        private static ParticleSystem CreateDust(Transform parent)
        {
            GameObject objectWithParticles = new GameObject("Landing Dust");
            objectWithParticles.transform.SetParent(parent, false);
            objectWithParticles.transform.localPosition = new Vector3(0f, -1f, 0f);
            ParticleSystem system = objectWithParticles.AddComponent<ParticleSystem>();
            var main = system.main;
            main.startLifetime = 0.45f;
            main.startSpeed = 2.2f;
            main.startSize = 0.24f;
            main.startColor = new Color(0.72f, 0.67f, 0.55f, 0.8f);
            main.loop = false;
            main.playOnAwake = false;
            var emission = system.emission;
            emission.enabled = false;
            var shape = system.shape;
            shape.shapeType = ParticleSystemShapeType.Hemisphere;
            shape.radius = 0.35f;
            return system;
        }

        private static ParticleSystem CreateGoalParticles(Transform parent)
        {
            GameObject objectWithParticles = new GameObject("Goal Particles");
            objectWithParticles.transform.SetParent(parent, false);
            ParticleSystem system = objectWithParticles.AddComponent<ParticleSystem>();
            var main = system.main;
            main.startLifetime = 1.4f;
            main.startSpeed = 1.5f;
            main.startSize = 0.18f;
            main.startColor = new ParticleSystem.MinMaxGradient(new Color(0.2f, 1f, 0.35f), new Color(1f, 0.85f, 0.15f));
            main.loop = true;
            var emission = system.emission;
            emission.rateOverTime = 18f;
            var shape = system.shape;
            shape.shapeType = ParticleSystemShapeType.Box;
            shape.scale = new Vector3(1.5f, 2.2f, 2.2f);
            return system;
        }

        private void EnsureStyles()
        {
            if (titleStyle != null)
            {
                return;
            }

            titleStyle = new GUIStyle(GUI.skin.label) { alignment = TextAnchor.MiddleCenter, fontSize = 24, fontStyle = FontStyle.Bold };
            instructionStyle = new GUIStyle(GUI.skin.label) { alignment = TextAnchor.MiddleCenter, fontSize = 16 };
            successStyle = new GUIStyle(GUI.skin.label) { alignment = TextAnchor.MiddleCenter, fontSize = 28, fontStyle = FontStyle.Bold };
            successStyle.normal.textColor = new Color(0.3f, 1f, 0.45f);
        }
    }
}
