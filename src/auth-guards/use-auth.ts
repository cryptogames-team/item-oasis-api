import { UseGuards, applyDecorators } from "@nestjs/common"
import { UserGuard } from "./auth.guard"

const UseAuthGuard = () => {
    return applyDecorators(
        UseGuards(UserGuard)
    );
}

export default UseAuthGuard;