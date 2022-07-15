import { Router } from "express";
export class AuthRoutes {
  public router: Router;

  public constructor() {
    this.router = Router();
    this.configureRoutes();
  }

  private configureRoutes() {
  }
}
