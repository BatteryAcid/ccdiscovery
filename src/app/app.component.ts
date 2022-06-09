import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../API.service';
import { API } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'ccdiscovery';
    public createForm: FormGroup;
    public updateForm: FormGroup;
    public updateCustomLambdaForm: FormGroup;
    public todos: Array<Todo> = [];

    constructor(private fb: FormBuilder) {
        this.createForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required]
        });

        this.updateForm = this.fb.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required]
        });

        this.updateCustomLambdaForm = this.fb.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required]
        });
    }

    public async onCreate(todo: Todo) {
        console.log("Calling onCreate.");
        let createTodoResponse = await API.graphql({
            query: mutations.createTodo,
            variables: { input: todo },
            authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
        }) as GraphQLResult<any>;
        console.log(createTodoResponse);
        this.createForm.reset();
        await this.listTodos();
    }

    public async onUpdate(todo: Todo) {
        console.log("Calling onUpdate.");
        let updateTodoResponse = await API.graphql({
            query: mutations.updateTodo,
            variables: { input: todo },
            authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
        }) as GraphQLResult<any>;
        console.log(updateTodoResponse);
        this.updateForm.reset();
        await this.listTodos();
    }

    public async onCustomUpdate(todo: Todo) {
        console.log("Calling onCustomUpdate.");
        let updateTodoResponse = await API.graphql({
            query: mutations.todoCustomLambda,
            variables: { input: todo },
            authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
        }) as GraphQLResult<any>;
        console.log(updateTodoResponse);
        this.updateCustomLambdaForm.reset();
        await this.listTodos();
    }

    async populateUpdateForm(todo: Todo) {
        this.updateForm.patchValue(todo);
    }

    async populateUpdateCustomLambdaForm(todo: Todo) {
        this.updateCustomLambdaForm.patchValue(todo);
    }

    async listTodos() {
        let listTodoResponse = await API.graphql({
            query: queries.listTodos,
            authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
        }) as GraphQLResult<any>;
        console.log(listTodoResponse);
        this.todos = listTodoResponse.data.listTodos.items as Todo[];
    }

    async ngOnInit() {
        await this.listTodos();
    }
}
