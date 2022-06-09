import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../API.service';
import { API } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { GraphQLResult } from '@aws-amplify/api-graphql';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'ccdiscovery';
    public createForm: FormGroup;
    public todos: Array<Todo> = [];

    constructor(private fb: FormBuilder) {
        this.createForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required]
        });
    }

    public async onCreate(todo: Todo) {
        console.log("Calling onCreate.");
        let createTodoResponse = await API.graphql({
            query: mutations.createTodo,
            variables: { input: todo }
        }) as GraphQLResult<any>;
        console.log(createTodoResponse);
        this.createForm.reset();
        await this.listTodos();
    }

    async listTodos() {
        let listTodoResponse = await API.graphql({
            query: queries.listTodos
        }) as GraphQLResult<any>;
        console.log(listTodoResponse);
        this.todos = listTodoResponse.data.listTodos.items as Todo[];
    }

    async ngOnInit() {
        await this.listTodos();
    }
}
