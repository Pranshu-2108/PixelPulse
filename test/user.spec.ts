import User from "../lib/database/models/user.model";
import { describe, expect, it, beforeAll, vi } from "vitest";



describe('These are User Tests', () => {
    let response: Response;

    describe("this is user logout function", async () => {

        response = await fetch(
            'http://localhost:3000/api/user/logout',
        );
    
        it("function should return status 200", () => {
            expect(response.status).toBe(200);
        });
    
    });

    describe("this is user login function", () => {
    
        it("function should return status 200", async () => {
            const mockUser = {
                _id: "1",
                email: "hello@gmail.com",
                firstName: "hello",
                lastName: "World",
                password: "123456",
                planId: "1",
                creditBalance: 7,
            };
            const userModelMock = {
                findOne: () => Promise.resolve(mockUser),
            };
              
            const obj = {
                email : "pranshu@example.com" , password: "123456"
            }
    
            Object.assign(User, userModelMock);
    
            vi.mock('bcryptjs', async (importOriginal) => {
                return {
                  ...await importOriginal<typeof import('bcryptjs')>(),
                  bcrypt: {
                    compare: () => Promise.resolve(true)
                  }
                }
            })
    
            vi.mock('jsonwebtoken', async (importOriginal) => {
                return {
                  ...await importOriginal<typeof import('jsonwebtoken')>(),
                  jwt: {
                    sign: () => Promise.resolve("token")
                  }
                }
            })
    
            response = await fetch("http://localhost:3000/api/user/login", {
                method: "POST",
                body: JSON.stringify(obj)
            });
    
            console.log(response)
            expect(response.status).toBe(200);
        });
    
    });

})