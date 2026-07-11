using UnityEngine;

namespace SideScrollerWorkflowTest
{
    public sealed class PlayerController : MonoBehaviour
    {
        private const float MoveSpeed = 7f;
        private const float JumpVelocity = 8.5f;
        private Rigidbody body;
        private ParticleSystem landingDust;
        private Vector3 spawnPoint;
        private bool controlsEnabled = true;
        private bool wasGrounded;

        public bool ControlsEnabled => controlsEnabled;

        public void Configure(Rigidbody playerBody, ParticleSystem dust, Vector3 start)
        {
            body = playerBody;
            landingDust = dust;
            spawnPoint = start;
        }

        private void Update()
        {
            if (!controlsEnabled || body == null)
            {
                return;
            }

            bool grounded = IsGrounded();
            if (grounded && !wasGrounded && body.linearVelocity.y < 1f)
            {
                landingDust.Emit(14);
            }

            if (grounded && Input.GetKeyDown(KeyCode.Space))
            {
                Vector3 velocity = body.linearVelocity;
                velocity.y = JumpVelocity;
                body.linearVelocity = velocity;
            }

            wasGrounded = grounded;
        }

        private void FixedUpdate()
        {
            if (!controlsEnabled || body == null)
            {
                return;
            }

            float input = 0f;
            if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow)) input -= 1f;
            if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow)) input += 1f;
            Vector3 velocity = body.linearVelocity;
            velocity.x = input * MoveSpeed;
            body.linearVelocity = velocity;
        }

        public void ResetTo(Vector3 position)
        {
            transform.position = position;
            transform.rotation = Quaternion.identity;
            body.linearVelocity = Vector3.zero;
            body.angularVelocity = Vector3.zero;
            controlsEnabled = true;
        }

        public void SetFinished()
        {
            controlsEnabled = false;
            body.linearVelocity = Vector3.zero;
            body.isKinematic = true;
        }

        public void HitObstacle()
        {
            if (controlsEnabled)
            {
                ResetTo(spawnPoint);
            }
        }

        private bool IsGrounded()
        {
            return Physics.SphereCast(transform.position + Vector3.up * 0.1f, 0.38f, Vector3.down, out _, 1.18f, ~0, QueryTriggerInteraction.Ignore);
        }
    }
}
