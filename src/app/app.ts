// app.component.ts
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
  materials: { [key: string]: number };
  insights: string[];
  recommendations: string[];
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <div class="header-logo">
            <div class="logo-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="logo-text">
              <h1>InnDrawing AI</h1>
              <p>AI Insights from your construction drawings</p>
            </div>
          </div>
        </div>
      </header>

      <div class="main-container">
        <!-- Feature Cards -->
        <div class="feature-cards">
          <div class="feature-card">
            <div class="feature-icon blue">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3>Trade Identification</h3>
            <p>Identify and classify trades directly from construction drawings for better planning.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon green">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3>Automated Quantity Take-offs</h3>
            <p>Speed up estimation processes with AI-driven material take-offs.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon purple">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3>Streamlined Project Execution</h3>
            <p>Use AI-powered drawing analysis to enhance planning and ensure smoother execution.</p>
          </div>
        </div>

        <!-- Main Content -->
        <div class="content-grid">
          <!-- Upload and Analysis Section -->
          <div class="upload-section">
            <div class="card">
              <h2>Upload Construction Drawing</h2>
              
              <!-- File Upload Area -->
              <div class="upload-area" 
                   [class.has-file]="selectedFile"
                   (dragover)="onDragOver($event)" 
                   (drop)="onDrop($event)"
                   (click)="fileInput.click()">
                <input #fileInput type="file" class="file-input" accept="image/*" (change)="onFileSelected($event)">
                
                <div *ngIf="!selectedFile && !uploadedImage" class="upload-placeholder">
                  <svg class="upload-icon" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <div class="upload-text">
                    <p class="upload-title">Drop your construction drawing here</p>
                    <p class="upload-subtitle">or click to browse files</p>
                    <p class="upload-info">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>

                <div *ngIf="selectedFile && !uploadedImage" class="file-selected">
                  <div class="file-info">
                    <svg class="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <span class="file-name">{{selectedFile.name}}</span>
                  </div>
                  <button (click)="analyzeDrawing()" 
                          [disabled]="isAnalyzing"
                          class="analyze-btn">
                    <span *ngIf="!isAnalyzing">Analyze Drawing</span>
                    <span *ngIf="isAnalyzing" class="loading">
                      <svg class="spinner" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing...</span>
                    </span>
                  </button>
                </div>
              </div>

              <!-- Uploaded Image Preview -->
              <div *ngIf="uploadedImage" class="image-preview">
                <h3>Uploaded Drawing</h3>
                <div class="image-container">
                  <img [src]="uploadedImage" alt="Construction Drawing">
                </div>
                <button (click)="clearImage()" class="clear-btn">Clear Image</button>
              </div>

              <!-- Analysis Results -->
              <div *ngIf="analysisResult" class="analysis-results">
                <h3>Analysis Results</h3>
                
                <!-- Trades Identified -->
                <div class="result-section trades">
                  <h4>Trades Identified</h4>
                  <div class="tags">
                    <span *ngFor="let trade of analysisResult.trades" class="tag">{{trade}}</span>
                  </div>
                </div>

                <!-- Material Quantities -->
                <div class="result-section materials">
                  <h4>Material Quantities</h4>
                  <div class="materials-grid">
                    <div *ngFor="let material of getMaterialEntries()" class="material-item">
                      <span class="material-name">{{material.key}}</span>
                      <span class="material-value">{{material.value}}</span>
                    </div>
                  </div>
                </div>

                <!-- Insights -->
                <div class="result-section insights">
                  <h4>AI Insights</h4>
                  <ul class="insights-list">
                    <li *ngFor="let insight of analysisResult.insights">
                      <svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                      </svg>
                      <span>{{insight}}</span>
                    </li>
                  </ul>
                </div>

                <!-- Recommendations -->
                <div class="result-section recommendations">
                  <h4>Recommendations</h4>
                  <ul class="recommendations-list">
                    <li *ngFor="let recommendation of analysisResult.recommendations">
                      <svg class="warning-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      <span>{{recommendation}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Section -->
          <div class="chat-section">
            <div class="chat-card">
              <h2>AI Assistant</h2>
              
              <!-- Chat Messages -->
              <div class="chat-messages" #chatMessagesContainer>
                <div *ngFor="let message of chatMessages" 
                     [class]="'message ' + message.role">
                  <div class="message-bubble">
                    <p class="message-text">{{message.content}}</p>
                    <p class="message-time">{{message.timestamp | date:'short'}}</p>
                  </div>
                </div>
                
                <div *ngIf="chatMessages.length === 0" class="chat-empty">
                  <svg class="chat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  <p>Start a conversation about your construction drawing!</p>
                </div>
              </div>

              <!-- Chat Input -->
              <div class="chat-input">
                <input [(ngModel)]="currentMessage" 
                       (keyup.enter)="sendMessage()"
                       placeholder="Ask about your drawing..."
                       class="message-input">
                <button (click)="sendMessage()" 
                        [disabled]="!currentMessage.trim() || isSendingMessage"
                        class="send-btn">
                  <svg *ngIf="!isSendingMessage" class="send-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  <svg *ngIf="isSendingMessage" class="spinner" fill="none" viewBox="0 0 24 24">
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
  `,
  // styleUrls: ['./app.component.scss']
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
  
  // Replace with your actual Gemini API key
  private readonly GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
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
    if (file.type.startsWith('image/')) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file (PNG, JPG, etc.)');
    }
  }

  clearImage() {
    this.selectedFile = null;
    this.uploadedImage = null;
    this.analysisResult = null;
  }

  async analyzeDrawing() {
    if (!this.selectedFile) return;

    this.isAnalyzing = true;
    
    try {
      // Simulate AI analysis for demo purposes
      // In production, replace this with actual Gemini API call
      await this.simulateAnalysis();
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please check your API key and try again.');
    } finally {
      this.isAnalyzing = false;
    }
  }

  private async simulateAnalysis() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis result
    this.analysisResult = {
      trades: ['Electrical', 'Plumbing', 'HVAC', 'Structural', 'Drywall'],
      materials: {
        'Concrete': 45,
        'Steel Rebar': 2500,
        'Electrical Wire': 850,
        'PVC Pipe': 120,
        'Insulation': 300,
        'Drywall Sheets': 80
      },
      insights: [
        'The drawing shows a multi-story residential building with complex electrical systems',
        'HVAC layout indicates central air conditioning with ductwork on each floor',
        'Plumbing system appears to be well-designed with proper drainage slopes',
        'Structural elements include reinforced concrete with steel framework',
        'Electrical panel locations are strategically placed for efficient distribution'
      ],
      recommendations: [
        'Schedule electrical rough-in before insulation installation',
        'Coordinate HVAC ductwork with structural elements to avoid conflicts',
        'Consider adding additional electrical outlets in common areas',
        'Ensure proper ventilation in bathroom and kitchen areas',
        'Review fire safety exits and emergency lighting placement',
        'Plan for future smart home integration capabilities'
      ]
    };
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
      // Simulate AI chat response
      await this.simulateChatResponse(messageToSend);
      
    } catch (error) {
      console.error('Chat message failed:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your API key and try again.',
        timestamp: new Date()
      };
      this.chatMessages.push(errorMessage);
    } finally {
      this.isSendingMessage = false;
    }
  }

  private async simulateChatResponse(message: string) {
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let response = '';
    
    if (message.toLowerCase().includes('material') || message.toLowerCase().includes('quantity')) {
      response = 'Based on the drawing analysis, the main materials needed include concrete, steel rebar, electrical wiring, and PVC pipes. The quantities are estimated based on the building dimensions and complexity shown in the drawing.';
    } else if (message.toLowerCase().includes('trade') || message.toLowerCase().includes('worker')) {
      response = 'The drawing indicates work for multiple trades: electrical contractors for wiring and panel installation, plumbers for water and drainage systems, HVAC technicians for air conditioning, and structural workers for concrete and steel work.';
    } else if (message.toLowerCase().includes('time') || message.toLowerCase().includes('schedule')) {
      response = 'Based on the complexity shown in the drawing, I recommend starting with structural work, followed by electrical and plumbing rough-ins, then HVAC installation, and finally finishing work. This typically takes 6-8 months for a project of this scale.';
    } else if (message.toLowerCase().includes('cost') || message.toLowerCase().includes('budget')) {
      response = 'Cost estimation requires detailed specifications, but based on the materials identified and project scope, you should budget for materials, labor, permits, and a 10-15% contingency for unexpected issues.';
    } else {
      response = 'I can help you understand various aspects of your construction drawing including materials, trades, scheduling, and best practices. What specific aspect would you like to know more about?';
    }

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    this.chatMessages.push(assistantMessage);
  }

  getMaterialEntries() {
    return this.analysisResult ? 
      Object.entries(this.analysisResult.materials).map(([key, value]) => ({key, value})) : 
      [];
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}