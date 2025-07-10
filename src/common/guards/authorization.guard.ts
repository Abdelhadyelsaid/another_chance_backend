import { CanActivate, ExecutionContext, HttpException, HttpStatus, mixin } from "@nestjs/common";
import { Role } from "../enum/roles.enum";
import { ifRolesContainRole } from "../helper/if_roles_contain_role.helper";

export const RolesGuard = (roles: Role[]) => {

    class AuthorizationGuard implements CanActivate {

        async canActivate(context: ExecutionContext): Promise<boolean> {

            const request = context.switchToHttp().getRequest();
            const user_type_id = request.user_type_id
            
            if (!user_type_id) {
                console.log(`Authorization Guard Role: Forbidden Access!`)
                throw new HttpException("You are not authorized.", HttpStatus.FORBIDDEN);
            }

            const role: Role = Object.values(Role).at(user_type_id - 1) as Role;

            return ifRolesContainRole(roles, role)
        }
    }

    return mixin(AuthorizationGuard);
}
