import {
  SizeOverflowError,
  type SizeOverflowErrorType,
} from "../../errors/encoding";
import type { ErrorType } from "../../errors/utils";
import type { ByteArray, Hex } from "../../types/misc";
import { size as size_, type SizeErrorType } from "../data/size";

export type AssertSizeErrorType =
  | SizeOverflowErrorType
  | SizeErrorType
  | ErrorType;

export function assertSize(
  hexOrBytes: Hex | ByteArray,
  { size }: { size: number }
): void {
  if (size_(hexOrBytes) > size)
    throw new SizeOverflowError({
      givenSize: size_(hexOrBytes),
      maxSize: size,
    });
}
