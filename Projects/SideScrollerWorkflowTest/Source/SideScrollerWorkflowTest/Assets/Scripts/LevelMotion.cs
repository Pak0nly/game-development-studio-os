using UnityEngine;

namespace SideScrollerWorkflowTest
{
    public sealed class MovingPlatform : MonoBehaviour
    {
        private Vector3 start;
        private Vector3 end;
        private float speed;

        public void Configure(Vector3 first, Vector3 second, float movementSpeed)
        {
            start = first;
            end = second;
            speed = movementSpeed;
        }

        private void Update()
        {
            float distance = Vector3.Distance(start, end);
            float t = distance <= 0f ? 0f : Mathf.PingPong(Time.time * speed / distance, 1f);
            transform.position = Vector3.Lerp(start, end, t);
        }
    }

    public sealed class MovingObstacle : MonoBehaviour
    {
        private Vector3 start;
        private Vector3 end;
        private float speed;

        public void Configure(Vector3 first, Vector3 second, float movementSpeed)
        {
            start = first;
            end = second;
            speed = movementSpeed;
        }

        private void Update()
        {
            float distance = Vector3.Distance(start, end);
            float t = distance <= 0f ? 0f : Mathf.PingPong(Time.time * speed / distance, 1f);
            transform.position = Vector3.Lerp(start, end, t);
        }

        private void OnTriggerEnter(Collider other)
        {
            PlayerController player = other.GetComponent<PlayerController>();
            if (player != null)
            {
                player.HitObstacle();
            }
        }
    }

    public sealed class GoalTrigger : MonoBehaviour
    {
        private SideScrollerGame game;

        public void Configure(SideScrollerGame owner)
        {
            game = owner;
        }

        private void OnTriggerEnter(Collider other)
        {
            if (other.GetComponent<PlayerController>() != null)
            {
                game.CompleteLevel();
            }
        }
    }

    public sealed class CameraFollow : MonoBehaviour
    {
        private Transform target;
        private Vector3 offset;

        public void Configure(Transform followTarget, Vector3 followOffset)
        {
            target = followTarget;
            offset = followOffset;
        }

        private void LateUpdate()
        {
            if (target == null) return;
            Vector3 desired = target.position + offset;
            desired.y = Mathf.Max(desired.y, 3.5f);
            transform.position = Vector3.Lerp(transform.position, desired, 6f * Time.deltaTime);
            transform.rotation = Quaternion.identity;
        }
    }
}
