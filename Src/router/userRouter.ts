import { FastifyInstance } from "fastify";
import { UserController } from "../controller/userController";

export async function userRouter(app: FastifyInstance) {
    const controllUser = new UserController();

    app.route({
        method:'POST',
        url: '/createMember',
        handler: controllUser.createUser
    });

    app.route({
        method:'PUT',
        url: '/updateMember',
        handler: controllUser.updateUser
    });

    app.route({
        method:'GET',
        url: '/findByID',
        handler: controllUser.getById
    });

    app.route({
        method:'GET',
        url:'/findMany',
        handler: controllUser.getMany
    });

    app.route({
        method:'DELETE',
        url:'/deleteMember',
        handler:controllUser.deleteUser
    })


}