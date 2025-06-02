import boto3
import botocore.exceptions

TABLE_NAME = "yetanotherapp-xyz-terraform-state-lock-table-01-06-2025"
AWS_REGION = "eu-central-1"


class DynamoDBTable:
    def check(self):
        print("Setting up dynamodb ...")

    def teardown(self):
        dynamodb_client = boto3.client("dynamodb", region_name=AWS_REGION)

        print(f"Attempting to destroy Table '{TABLE_NAME}' in region '{AWS_REGION}'...")

        try:
            dynamodb_client.delete_table(TableName=TABLE_NAME)
            print(f"[SUCCESS] Table '{TABLE_NAME}' deleted.")
        except Exception as e:
            print(f"[ERROR] An unexpected error occurred: {e}")

    def setup(self):
        dynamodb_client = boto3.client("dynamodb", region_name=AWS_REGION)
        read_capacity = 1
        write_capacity = 1

        print(
            f"Attempting to create DynamoDB table '{TABLE_NAME}' in region '{AWS_REGION}'..."
        )

        try:
            response = dynamodb_client.create_table(
                TableName=TABLE_NAME,
                AttributeDefinitions=[
                    {"AttributeName": "LockID", "AttributeType": "S"}  # S = String Type
                ],
                KeySchema=[
                    {
                        "AttributeName": "LockID",
                        "KeyType": "HASH",
                    }  # HASH = Partition Key
                ],
                # Option 1: Provisioned Throughput (adjust units as needed, 1/1 is minimal)
                ProvisionedThroughput={
                    "ReadCapacityUnits": read_capacity,
                    "WriteCapacityUnits": write_capacity,
                },
                # Option 2: On-Demand Capacity (uncomment below and comment out ProvisionedThroughput)
                # BillingMode='PAY_PER_REQUEST'
            )

            print(f"create table command response - {response}")

            print(
                f"Table '{TABLE_NAME}' creation initiated. Waiting for table to become active..."
            )

            # Wait for the table to be created and become active
            waiter = dynamodb_client.get_waiter("table_exists")
            waiter.wait(
                TableName=TABLE_NAME,
                WaiterConfig={
                    "Delay": 5,  # Check every 5 seconds
                    "MaxAttempts": 12,  # Wait for up to 60 seconds (12 * 5)
                },
            )

            print(f"[SUCCESS] DynamoDB table '{TABLE_NAME}' created and active.")

        except botocore.exceptions.ClientError as e:
            error_code = e.response.get("Error", {}).get("Code")
            if error_code == "ResourceInUseException":
                print(
                    f"[INFO] DynamoDB table '{TABLE_NAME}' already exists. Skipping creation."
                )
            else:
                print(f"[ERROR] Failed to create DynamoDB table '{TABLE_NAME}': {e}")
        except Exception as e:
            print(f"[ERROR] An unexpected error occurred: {e}")
