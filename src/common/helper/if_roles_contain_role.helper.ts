import _, { isEqual } from "lodash"
import { Role } from "../enum/roles.enum"

export function ifRolesContainRole(roles: Role[], role: Role): boolean {

    var result = false

    for (const item of roles) {
        const current_role = Object.values(Role).at(item) as Role
        if (current_role.valueOf() === role.valueOf()) result = true
    }

    return result
}