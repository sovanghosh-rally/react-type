import { ProgramApiInterface } from './api';
import axios from 'axios';

/**
 * ProgramApiMock - Mock up implementation
 * @export
 * @class ProgramApiMock
 */
export class ProgramApiMock implements ProgramApiInterface {
    /**
     * 
     * @summary Get all programs for a user
     * @param {string} rallyId 
     * @memberof ProgramApi
     */
    public getAllPrograms(rallyId: string, options?: any) {
        return axios.get('./programs.json');
    }
}