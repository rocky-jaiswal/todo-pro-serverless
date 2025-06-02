import sys
import argparse

from src.setup_state import SetupTFState


def parse_arguments():
    """Parse command line arguments using argparse"""
    parser = argparse.ArgumentParser(
        description="Setup / Teardown TF State",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Example: uv run main.py -a setup",
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
        SetupTFState().setup()

    if args.action == "teardown":
        SetupTFState().teardown()


if __name__ == "__main__":
    main()
