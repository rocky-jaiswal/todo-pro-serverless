import boto3
import botocore.exceptions
import time


BUCKET_NAME = "yetanotherapp-xyz-terraform-state-bucket-01-06-2025"
AWS_REGION = "eu-central-1"


class S3Bucket:
    def check(self):
        print("Setting up s3 ...")

    def teardown(self):
        s3_client = boto3.client("s3", region_name=AWS_REGION)

        print(
            f"Attempting to destroy S3 bucket '{BUCKET_NAME}' in region '{AWS_REGION}'..."
        )

        try:
            s3_client.delete_bucket(Bucket=BUCKET_NAME)
            print(f"[SUCCESS] Bucket '{BUCKET_NAME}' deleted.")
        except Exception as e:
            print(f"[ERROR] An unexpected error occurred: {e}")

    def setup(self):
        s3_client = boto3.client("s3", region_name=AWS_REGION)

        print(
            f"Attempting to create S3 bucket '{BUCKET_NAME}' in region '{AWS_REGION}'..."
        )

        try:
            # Create bucket - Handle region constraint difference for us-east-1
            if AWS_REGION == "us-east-1":
                s3_client.create_bucket(Bucket=BUCKET_NAME)
            else:
                s3_client.create_bucket(
                    Bucket=BUCKET_NAME,
                    CreateBucketConfiguration={"LocationConstraint": AWS_REGION},
                )
            print(f"[SUCCESS] Bucket '{BUCKET_NAME}' created.")

            # Wait briefly for bucket propagation (optional)
            time.sleep(5)

            # Enable Versioning
            print(f"Enabling versioning for bucket '{BUCKET_NAME}'...")
            s3_client.put_bucket_versioning(
                Bucket=BUCKET_NAME, VersioningConfiguration={"Status": "Enabled"}
            )
            print("[SUCCESS] Versioning enabled.")

            # Enable Server-Side Encryption (SSE-S3)
            print(
                f"Enabling server-side encryption (AES256) for bucket '{BUCKET_NAME}'..."
            )
            s3_client.put_bucket_encryption(
                Bucket=BUCKET_NAME,
                ServerSideEncryptionConfiguration={
                    "Rules": [
                        {
                            "ApplyServerSideEncryptionByDefault": {
                                "SSEAlgorithm": "AES256"
                            }
                        },
                    ]
                },
            )
            print("[SUCCESS] Server-side encryption enabled.")

            # Block Public Access
            print(
                f"Applying Block Public Access settings for bucket '{BUCKET_NAME}'..."
            )
            s3_client.put_public_access_block(
                Bucket=BUCKET_NAME,
                PublicAccessBlockConfiguration={
                    "BlockPublicAcls": True,
                    "IgnorePublicAcls": True,
                    "BlockPublicPolicy": True,
                    "RestrictPublicBuckets": True,
                },
            )
            print("[SUCCESS] Block Public Access settings applied.")
            print(f"\nS3 Bucket setup complete: {BUCKET_NAME}")

        except botocore.exceptions.ClientError as e:
            error_code = e.response.get("Error", {}).get("Code")
            if error_code == "BucketAlreadyOwnedByYou":
                print(
                    f"[INFO] Bucket '{BUCKET_NAME}' already exists and is owned by you. Skipping creation."
                )
                # Consider adding checks here to ensure existing bucket has correct settings
            elif error_code == "BucketAlreadyExists":
                print(
                    f"[ERROR] Bucket name '{BUCKET_NAME}' already exists (owned by someone else). Please choose a unique name."
                )
            elif error_code == "InvalidLocationConstraint":
                print(
                    f"[ERROR] Invalid region specified: {AWS_REGION}. Or trying to set LocationConstraint for us-east-1."
                )
            else:
                print(
                    f"[ERROR] Failed to create or configure bucket '{BUCKET_NAME}': {e}"
                )
        except Exception as e:
            print(f"[ERROR] An unexpected error occurred: {e}")
