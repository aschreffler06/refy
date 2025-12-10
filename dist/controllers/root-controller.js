import router from 'express-promise-router';
export class RootController {
    constructor() {
        this.path = '/';
        this.router = router();
    }
    register() {
        this.router.get('/', (req, res) => this.get(req, res));
    }
    async get(req, res) {
        res.status(200).json({ name: 'Discord Bot Cluster API', author: 'Kevin Novak' });
    }
}
//# sourceMappingURL=root-controller.js.map