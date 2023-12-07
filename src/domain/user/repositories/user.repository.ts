import { CustomRepository } from "src/core/typeorm-ex.decorator";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    
}