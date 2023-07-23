import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Todo } from './types/todo';
import { TodosService } from './services/todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit{
  private _todos: Todo[] = [];
  activeTodos: Todo[] = [];

  get todos() {
    return this._todos;
  }

  set todos(todos: Todo[]) {
    if (todos === this._todos) {
      return;
    }

    this._todos = todos;
    this.activeTodos = this.todos.filter(todo => !todo.completed);
  }

  constructor(
    private todosService: TodosService,
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todosService.getTodos()
      .subscribe((todos) => {
        this.todos = todos;
      });
  }

  trackById(i: number, todo: Todo) {
    return todo.id;
  }

  addTodo(newTitle: string) {
    this.todosService.createTodo(newTitle)
      .subscribe(() => this.loadTodos());
  }

  toggleTodo(todoId: number) {
    this.todos = this.todos.map(todo => {
      if (todo.id !== todoId) {
        return todo;
      }

      return { ...todo, completed: !todo.completed };
    })
  }

  renameTodo(todoId: number, newTitle: string) {
    this.todos = this.todos.map(todo => {
      if (todo.id !== todoId) {
        return todo;
      }

      return { ...todo, title: newTitle };
    })
  }

  deleteTodo(todoId: number) {
    this.todos = this.todos.filter(todo => todo.id !== todoId);
  }
}
