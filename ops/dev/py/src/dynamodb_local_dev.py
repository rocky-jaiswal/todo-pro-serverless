import sys
import argparse
import boto3
import botocore.exceptions

TABLE_NAME = "yetanotherapp-xyz-data-table"


class LocalDynamoDBTable:
    def teardown(self):
        dynamodb_client = boto3.client(
            "dynamodb",
            region_name="db",
            endpoint_url="http://db:8000",
            aws_access_key_id="sao9c6",
            aws_secret_access_key="ixxi48",
        )

        print(f"Attempting to destroy Table '{TABLE_NAME}' locally'...")

        try:
            dynamodb_client.delete_table(TableName=TABLE_NAME)
            print(f"[SUCCESS] Table '{TABLE_NAME}' deleted.")
        except Exception as e:
            print(f"[ERROR] An unexpected error occurred: {e}")

    def setup(self):
        dynamodb_client = boto3.client(
            "dynamodb",
            region_name="db",
            endpoint_url="http://db:8000",
            aws_access_key_id="sao9c6",
            aws_secret_access_key="ixxi48",
        )

        print(f"Attempting to create DynamoDB table '{TABLE_NAME}' locally'...")

        try:
            response = dynamodb_client.create_table(
                TableName=TABLE_NAME,
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
