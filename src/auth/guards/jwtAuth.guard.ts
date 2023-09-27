import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { PUBLIC_KEY } from "../../utils/constants";
import { getBooleanMetadata } from "../../utils/metadata/getBooleanMetadata";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  public constructor(private readonly reflector: Reflector) {
    super();
  }

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic: boolean = getBooleanMetadata(
      this.reflector,
      context,
      PUBLIC_KEY,
    );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
