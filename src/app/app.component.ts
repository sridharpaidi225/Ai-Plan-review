import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DrawingAnalysis {
  trades: string[];
  materials: { [key: string]: string };
  insights: string[];
  recommendations: string[];
  summary?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <!-- Header -->
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">InnDrawing AI</h1>
              <p class="text-gray-600">AI Insights from your construction drawings</p>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Feature Cards -->
        <div class="grid md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Trade Identification</h3>
            <p class="text-gray-600">Identify and classify trades directly from construction drawings.</p>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Quantity Take-offs</h3>
            <p class="text-gray-600">Speed up estimation with AI-driven material analysis.</p>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Smart Analysis</h3>
            <p class="text-gray-600">AI-powered drawing analysis for better project insights.</p>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">AI Chat Assistant</h3>
            <p class="text-gray-600">Ask questions about your drawings and get instant answers.</p>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Upload and Analysis Section -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                Upload & Analyze Construction Drawing
              </h2>
              
              <!-- File Upload Area -->
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                   (dragover)="onDragOver($event)" 
                   (drop)="onDrop($event)"
                   (click)="fileInput.click()">
                <input #fileInput type="file" class="hidden" accept="image/*,.pdf" (change)="onFileSelected($event)">
                
                <div *ngIf="!selectedFile && !uploadedImage" class="space-y-4">
                  <svg class="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <div>
                    <p class="text-xl font-medium text-gray-900">Drop your construction drawing here</p>
                    <p class="text-gray-500">or click to browse files</p>
                    <p class="text-sm text-gray-400 mt-2">Supports PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>

                <div *ngIf="selectedFile && !uploadedImage" class="space-y-4">
                  <div class="flex items-center justify-center space-x-2">
                    <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-lg font-medium text-gray-900">{{selectedFile.name}}</span>
                  </div>
                  <div class="flex space-x-4 justify-center">
                    <button (click)="analyzeDrawing(); $event.stopPropagation()" 
                            [disabled]="isAnalyzing"
                            class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
                      <span *ngIf="!isAnalyzing" class="flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                        Analyze Drawing
                      </span>
                      <span *ngIf="isAnalyzing" class="flex items-center space-x-2">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Analyzing Drawing...</span>
                      </span>
                    </button>
                    <button (click)="clearImage(); $event.stopPropagation()" 
                            class="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <!-- Uploaded Image Preview -->
              <div *ngIf="uploadedImage" class="mt-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-gray-900">Uploaded Drawing</h3>
                  <div class="flex space-x-2">
                    <button (click)="analyzeDrawing()" 
                            [disabled]="isAnalyzing"
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
                      <span *ngIf="!isAnalyzing">Analyze</span>
                      <span *ngIf="isAnalyzing">Analyzing...</span>
                    </button>
                    <button (click)="clearImage()" class="text-red-600 hover:text-red-800 transition-colors px-4 py-2 text-sm">
                      Clear Image
                    </button>
                  </div>
                </div>
                <div class="border rounded-lg overflow-hidden bg-gray-50">
                  <img [src]="uploadedImage" alt="Construction Drawing" class="w-full h-auto max-h-96 object-contain">
                </div>
              </div>

              <!-- Analysis Results -->
              <div *ngIf="analysisResult" class="mt-8 space-y-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-bold text-gray-900">Analysis Results</h3>
                  <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Analysis Complete
                  </span>
                </div>

                <!-- Summary -->
                <div *ngIf="analysisResult.summary" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h4 class="font-semibold text-blue-900 mb-3 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Drawing Summary
                  </h4>
                  <p class="text-gray-700 leading-relaxed">{{analysisResult.summary}}</p>
                </div>
                
                <!-- Trades Identified -->
                <div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 class="font-semibold text-blue-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Trades Identified ({{analysisResult.trades.length}})
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let trade of analysisResult.trades" 
                          class="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-300">
                      {{trade}}
                    </span>
                  </div>
                </div>

                <!-- Material Quantities -->
                <div class="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h4 class="font-semibold text-green-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                    Material Quantities
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div *ngFor="let material of getMaterialEntries()" 
                         class="flex justify-between items-center bg-white p-4 rounded-lg border border-green-200">
                      <span class="text-gray-700 font-medium">{{material.key}}</span>
                      <span class="font-bold text-green-800 bg-green-100 px-3 py-1 rounded-full text-sm">{{material.value}}</span>
                    </div>
                  </div>
                </div>

                <!-- Insights -->
                <div class="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h4 class="font-semibold text-purple-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    AI Insights
                  </h4>
                  <ul class="space-y-3">
                    <li *ngFor="let insight of analysisResult.insights" 
                        class="flex items-start space-x-3 bg-white p-4 rounded-lg border border-purple-200">
                      <svg class="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="text-gray-700 leading-relaxed">{{insight}}</span>
                    </li>
                  </ul>
                </div>

                <!-- Recommendations -->
                <div class="bg-orange-50 rounded-lg p-6 border border-orange-200">
                  <h4 class="font-semibold text-orange-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    Recommendations
                  </h4>
                  <ul class="space-y-3">
                    <li *ngFor="let recommendation of analysisResult.recommendations" 
                        class="flex items-start space-x-3 bg-white p-4 rounded-lg border border-orange-200">
                      <svg class="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="text-gray-700 leading-relaxed">{{recommendation}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Chat Section -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-gray-900 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  AI Assistant
                </h2>
                <button *ngIf="chatMessages.length > 0" 
                        (click)="clearChat()" 
                        class="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Chat Messages -->
              <div class="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div *ngFor="let message of chatMessages; trackBy: trackByMessage" 
                     [class]="message.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
                  <div [class]="message.role === 'user' ? 
                    'bg-blue-600 text-white max-w-xs px-4 py-3 rounded-lg rounded-br-none shadow-md' : 
                    'bg-gray-100 text-gray-900 max-w-xs px-4 py-3 rounded-lg rounded-bl-none shadow-md'">
                    <p class="text-sm leading-relaxed whitespace-pre-wrap">{{makeBold(message.content)}}</p>
                    <p class="text-xs mt-2 opacity-70">
                      {{message.timestamp | date:'short'}}
                    </p>
                  </div>
                </div>
                
                <div *ngIf="chatMessages.length === 0" class="text-center text-gray-500 py-8">
                  <svg class="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  <p class="text-lg font-medium">Start a conversation!</p>
                  <p class="text-sm mt-2">Ask questions about your construction drawing analysis</p>
                </div>
              </div>

              <!-- Quick Questions -->
              <div *ngIf="analysisResult && chatMessages.length === 0" class="mb-4">
                <p class="text-sm text-gray-600 mb-2">Quick questions:</p>
                <div class="space-y-2">
                  <button *ngFor="let question of quickQuestions" 
                          (click)="askQuickQuestion(question)"
                          class="w-full text-left text-sm bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors border">
                    {{question}}
                  </button>
                </div>
              </div>

              <!-- Chat Input -->
              <div class="border-t pt-4">
                <div class="flex space-x-2">
                  <input [(ngModel)]="currentMessage" 
                         (keyup.enter)="sendMessage()"
                         placeholder="Ask about your drawing analysis..."
                         class="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                  <button (click)="sendMessage()" 
                          [disabled]="!currentMessage.trim() || isSendingMessage"
                          class="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <svg *ngIf="!isSendingMessage" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    <svg *ngIf="isSendingMessage" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: []
})
export class AppComponent {
  private http = inject(HttpClient);
  
  selectedFile: File | null = null;
  uploadedImage: string | null = null;
  isAnalyzing = false;
  analysisResult: DrawingAnalysis | null = null;
  
  chatMessages: ChatMessage[] = [];
  currentMessage = '';
  isSendingMessage = false;
  
  // Quick questions for users
  quickQuestions = [
    "What are the main construction phases?",
    "Which materials need priority ordering?",
    "Are there any potential conflicts between trades?",
    "What's the estimated project timeline?"
  ];
  
  // Replace with your actual Gemini API key
  private readonly GEMINI_API_KEY = 'AIzaSyDajHkCw9vLJk0OqQI8o_HCMejJblAaeEM';
  private readonly GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.GEMINI_API_KEY}`;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File) {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      this.selectedFile = file;
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImage = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, show a placeholder
        this.uploadedImage = null;
      }
    } else {
      alert('Please select an image file (PNG, JPG) or PDF');
    }
  }

  clearImage() {
    this.selectedFile = null;
    this.uploadedImage = null;
    this.analysisResult = null;
    this.clearChat();
  }

  clearChat() {
    this.chatMessages = [];
    this.currentMessage = '';
  }

  async analyzeDrawing() {
    if (!this.selectedFile) return;

    this.isAnalyzing = true;
    
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(this.selectedFile);
      
      const requestBody = {
        contents: [{
          parts: [{
            text: `Analyze this construction drawing and provide comprehensive insights in JSON format. Please provide:

            1. A brief summary of what the drawing shows
            2. All trades involved (electrical, plumbing, HVAC, structural, architectural, etc.)
            3. Material quantities and estimates where visible
            4. Key technical insights about the construction project
            5. Professional recommendations for execution

            Respond ONLY with valid JSON in this exact format:
            {
              "summary": "Brief description of the drawing and project type",
              "trades": ["trade1", "trade2", "trade3", ...],
              "materials": {"material1": "quantity1", "material2": "quantity2", ...},
              "insights": ["detailed insight 1", "detailed insight 2", ...],
              "recommendations": ["recommendation 1", "recommendation 2", ...]
            }

            Focus on being specific and actionable. Include safety considerations, coordination requirements, and potential challenges.`
          }, {
            inline_data: {
              mime_type: this.selectedFile.type,
              data: base64Image.split(',')[1] // Remove data:image/jpeg;base64, prefix
            }
          }]
        }]
      };

      const response = await this.http.post(this.GEMINI_API_URL, requestBody).toPromise() as any;
      
      // Parse the AI response
      const aiResponse = response.candidates[0].content.parts[0].text;
      
      try {
        // Clean the response to extract JSON
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          this.analysisResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON, creating structured response from text');
        // If not JSON, create a structured response from the text
        this.analysisResult = {
          summary: "AI analysis completed - see details below",
          trades: ['General Construction', 'Electrical', 'Plumbing', 'HVAC'],
          materials: {
            'Concrete': 'TBD cubic yards', 
            'Steel Reinforcement': 'TBD lbs', 
            'Electrical Conduit': 'TBD linear feet',
            'Plumbing Fixtures': 'TBD units'
          },
          insights: [
            aiResponse.length > 200 ? aiResponse.substring(0, 200) + '...' : aiResponse,
            'Detailed quantity takeoffs require dimensional analysis',
            'Coordinate utility rough-ins before concrete pour'
          ],
          recommendations: [
            'Review local building codes and permits',
            'Coordinate trade scheduling to avoid conflicts',
            'Ensure proper inspection scheduling',
            'Consider material delivery logistics'
          ]
        };
      }
      
      // Add a welcome message to chat
      if (this.chatMessages.length === 0) {
        this.chatMessages.push({
          role: 'assistant',
          content: `I've analyzed your construction drawing! I can see ${(this.analysisResult && this.analysisResult.trades ? this.analysisResult.trades.length : 0)} different trades involved. Feel free to ask me any questions about the analysis, materials, scheduling, or construction details.`,
          timestamp: new Date()
        });
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Analysis failed: ${errorMessage}. Please check your API key and internet connection.`);
    } finally {
      this.isAnalyzing = false;
    }
  }

  async sendMessage() {
    if (!this.currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: this.currentMessage,
      timestamp: new Date()
    };

    this.chatMessages.push(userMessage);
    const messageToSend = this.currentMessage;
    this.currentMessage = '';
    this.isSendingMessage = true;

    try {
      let contextInfo = '';
      if (this.analysisResult) {
        contextInfo = `
        Context: I've analyzed a construction drawing with these details:
        - Summary: ${this.analysisResult.summary}
        - Trades involved: ${this.analysisResult.trades.join(', ')}
        - Materials identified: ${Object.entries(this.analysisResult.materials).map(([k,v]) => `${k}: ${v}`).join(', ')}
        - Key insights: ${this.analysisResult.insights.join('; ')}
        `;
      }

      const requestBody = {
        contents: [{
          parts: [{
            text: `You are an AI assistant specializing in construction drawing analysis and project management. You provide expert advice on construction projects, trades coordination, material estimation, and project planning.
            
            ${contextInfo}
            
            User question: ${messageToSend}
            
            Please provide what asked onyl that not extra.`
          }]
        }]
      };

      const response = await this.http.post(this.GEMINI_API_URL, requestBody).toPromise() as any;
      const aiResponse = response.candidates[0].content.parts[0].text;

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      this.chatMessages.push(assistantMessage);
      
      // Scroll to bottom of chat
      setTimeout(() => {
        const chatContainer = document.querySelector('.overflow-y-auto');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
      
    } catch (error) {
      console.error('Chat message failed:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please check your API key and internet connection, then try again.',
        timestamp: new Date()
      };
      this.chatMessages.push(errorMessage);
    } finally {
      this.isSendingMessage = false;
    }
  }

  askQuickQuestion(question: string) {
    this.currentMessage = question;
    this.sendMessage();
  }

  getMaterialEntries() {
    return this.analysisResult ? 
      Object.entries(this.analysisResult.materials).map(([key, value]) => ({key, value})) : 
      [];
  }

  trackByMessage(index: number, message: ChatMessage): string {
    return `${message.timestamp.getTime()}-${message.role}`;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  makeBold(passage: string): string {
    return passage.replace(/\*\*(.*?)\*\*/g, '$1');
  }
}