import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Category} from 'src/models/Category'
import {Task} from 'src/models/Task'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  lastCategory: number = 0;
  lastTask: number = 0;
  addCategory: boolean = false;
  addTask: boolean = true;
  listCategories: Category[] = [];
  listTasks: Task[] = [];

  newCategory: FormControl = new FormControl('');
  newTask: FormControl = new FormControl('');
  taskCategory: FormControl = new FormControl('');

  constructor() {}

  ngOnInit(): void {
    if(localStorage.getItem('Categories') !== null){
      this.listCategories = JSON.parse(localStorage.getItem('Categories') || '{}');
      this.lastCategory = [...this.listCategories].sort((a, b) => b.idCategory - a.idCategory)[0]?.idCategory ?? null;
      this.lastCategory +=1;
    }
    if(localStorage.getItem('Tasks') !== null){
      this.listTasks = JSON.parse(localStorage.getItem('Tasks') || '{}');
      this.lastTask = [...this.listTasks].sort((a, b) => b.idTask - a.idTask)[0]?.idTask ?? null;
      this.lastTask += 1;
    }
  }

  clickButtonTasks(){
    this.addTask = !this.addTask;
    this.addCategory = false;
  }

  clickButtonCategories(){
    this.addCategory = !this.addCategory;
    this.addTask = false;
  }

  clickAddCategory(){
    if(!this.listCategories.some(p => p.nameCategory === this.newCategory.value)){
      let newCat: Category = {
        idCategory: this.lastCategory,
        nameCategory: this.newCategory.value
      };
      this.listCategories.push(newCat);
      this.lastCategory += 1;
      this.newCategory = new FormControl('');
    }
    localStorage.setItem('Categories',JSON.stringify(this.listCategories));
  }

  clickDeleteCategory(idCategory: number){
    if(!this.listTasks.some(p => p.idCategory === idCategory)){
      this.listCategories = this.listCategories.filter(p => p.idCategory !== idCategory);
      localStorage.setItem('Categories',JSON.stringify(this.listCategories));
    }
  }

  changeCategory(event:any, idCategory:number){
    let catI = this.listCategories.findIndex(p => p.idCategory == idCategory);
    this.listCategories[catI].nameCategory = event.target.value;
    localStorage.setItem('Categories',JSON.stringify(this.listCategories));
  }

  clickAddTask(){
    if(this.listCategories.some(p => p.nameCategory === this.taskCategory.value)){
      if(!this.listTasks.some(p => p.nameTask === this.newTask.value)){
        let newTask: Task = {
          idTask: this.lastTask,
          nameTask: this.newTask.value,
          idCategory: this.listCategories.find(p => p.nameCategory == this.taskCategory.value)?.idCategory,
          status: false
        };
        this.listTasks.push(newTask);
        this.lastTask += 1;
        this.newTask = new FormControl('');
        this.taskCategory = new FormControl('');
      }
    }
    localStorage.setItem('Tasks',JSON.stringify(this.listTasks));
  }

  clickDeleteTask(idTask: number){
    this.listTasks = this.listTasks.filter(p => p.idTask !== idTask);
    localStorage.setItem('Tasks',JSON.stringify(this.listTasks));
  }
  
  getCategoryName(idCategory: any){
    return this.listCategories.find(p => p.idCategory === idCategory)?.nameCategory;
  }

  onCheckboxChange(idTask: number){
    let taskI = this.listTasks.findIndex(p => p.idTask == idTask);
    this.listTasks[taskI].status = !this.listTasks[taskI].status;
    localStorage.setItem('Tasks',JSON.stringify(this.listTasks));
  }
}
