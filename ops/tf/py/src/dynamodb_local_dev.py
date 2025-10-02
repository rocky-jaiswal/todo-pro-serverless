import sys
import argparse
import boto3
import botocore.exceptions

TABLE_NAME = "yetanotherapp-xyz-data-table"
TEST_TABLE_NAME = "yetanotherapp-xyz-data-test-table"


class LocalDynamoDBTable:
    def teardown(self):
        dynamodb_client = boto3.client(
            "dynamodb",
            region_name="db",
            endpoint_url="http://db:8000",
            aws_access_key_id="sao9c6",
            aws_secret_access_key="ixxi48",
        )

        print("Attempting to destroy Tables locally'...")

        try:
            dynamodb_client.delete_table(TableName=TABLE_NAME)
            dynamodb_client.delete_table(TableName=TEST_TABLE_NAME)
            print("[SUCCESS] Tables deleted.")
        except Exception as e:
            print(f"[ERROR] An unexpected error occurred: {e}")

    def setup(self):
        for table_name in [TABLE_NAME, TEST_TABLE_NAME]:
            self.create_table(table_name)

    def create_table(self, table_name):
        dynamodb_client = boto3.client(
            "dynamodb",
            region_name="db",
            endpoint_url="http://db:8000",
            aws_access_key_id="sao9c6",
            aws_secret_access_key="ixxi48",
        )

        print(f"Attempting to create DynamoDB table '{table_name}' locally'...")

        try:
            response = dynamodb_client.create_table(
                TableName=table_name,
                AttributeDefinitions=[
                    {"AttributeName": "pk", "AttributeType": "S"},
                    {"AttributeName": "sk", "AttributeType": "S"},
                    {
                        "AttributeName": "entityType",
                        "AttributeType": "S",
                    },
                ],
                KeySchema=[
                    {
                        "AttributeName": "pk",
                        "KeyType": "HASH",  # Partition key
                    },
                    {
                        "AttributeName": "sk",
                        "KeyType": "RANGE",  # Sort key
                    },
                ],
                GlobalSecondaryIndexes=[
                    {
                        "IndexName": "entityTypeIndex",
                        "KeySchema": [
                            {
                                "AttributeName": "pk",
                                "KeyType": "HASH",  # Partition key of the GSI
                            },
                            {
                                "AttributeName": "entityType",
                                "KeyType": "RANGE",  # Sort key of the GSI
                            },
                        ],
                        "Projection": {"ProjectionType": "ALL"},
                        "ProvisionedThroughput": {
                            "ReadCapacityUnits": 1,
                            "WriteCapacityUnits": 1,
                        },
                    }
                ],
                BillingMode="PAY_PER_REQUEST",
            )

            print(f"create table command response - {response}")

            print(
                f"Table '{table_name}' creation initiated. Waiting for table to become active..."
            )

            # Wait for the table to be created and become active
            waiter = dynamodb_client.get_waiter("table_exists")
            waiter.wait(
                TableName=table_name,
                WaiterConfig={
                    "Delay": 5,  # Check every 5 seconds
                    "MaxAttempts": 12,  # Wait for up to 60 seconds (12 * 5)
                },
            )

            print(f"[SUCCESS] DynamoDB table '{table_name}' created and active.")

        except botocore.exceptions.ClientError as e:
            error_code = e.response.get("Error", {}).get("Code")
            if error_code == "ResourceInUseException":
                print(
                    f"[INFO] DynamoDB table '{table_name}' already exists. Skipping creation."
                )
            else:
                print(f"[ERROR] Failed to create DynamoDB table '{table_name}': {e}")
        except Exception as e:
            print(f"[ERROR] An unexpected error occurred: {e}")


def parse_arguments():
    """Parse command line arguments using argparse"""
    parser = argparse.ArgumentParser(
        description="Setup / Teardown Local DynamoDB",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Example: uv run ... -a setup",
    )

    parser.add_argument(
        "--action",
        "-a",
        required=True,
        help="action - setup / teardown",
    )

    return parser.parse_args()


def main():
    args = parse_arguments()

    if args.action != "setup" and args.action != "teardown":
        print("Error! Only actions allowed are - 'setup' or 'teardown'")
        sys.exit(1)

    if args.action == "setup":
        LocalDynamoDBTable().setup()

    if args.action == "teardown":
        LocalDynamoDBTable().teardown()


if __name__ == "__main__":
    main()
