import { paroquiasController } from "@controller/paroquiasController";
import { FastifyInstance } from "fastify";


export async function paroquiasRouter(app: FastifyInstance) {
    const controllParoquia = new paroquiasController();

    app.route({
        method:'POST',
        url: '/createParoquia',
        handler: controllParoquia.createParoquias
    });

    // app.route({
    //     method:'PUT',
    //     url: '/updateMember',
    //     handler: controllParoquia.update
    // });

    app.route({
        method:'GET',
        url: '/findByID',
        handler: controllParoquia.getParoquiaById
    });

    app.route({
        method:'GET',
        url:'/findMany',
        handler: controllParoquia.getParoquiaMany
    });

    app.route({
        method:'DELETE',
        url:'/deleteParoquia',
        handler:controllParoquia.deleteParoquia
    })


}