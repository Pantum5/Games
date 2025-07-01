body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);
  color: #222;
  margin: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#name-form-container {
  margin: auto;
  text-align: center;
  padding-top: 100px;
}

#name-input {
  padding: 10px 14px;
  font-size: 18px;
  margin-top: 10px;
  width: 280px;
  border-radius: 8px;
  border: 1.5px solid #888;
  transition: border-color 0.3s;
}

#name-input:focus {
  border-color: #3a86ff;
  outline: none;
}

#name-form button {
  margin-left: 15px;
  padding: 10px 20px;
  font-size: 18px;
  border-radius: 8px;
  border: none;
  background-color: #3a86ff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

#name-form button:hover {
  background-color: #2657a6;
}

#header-bar {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 15px;
  font-weight: 700;
  font-size: 20px;
  color: #1a1a1a;
  user-select: none;
}

#user-name {
  text-align: left;
}

#score-info {
  text-align: right;
}

#question-container {
  background: rgba(255,255,255,0.9);
  border-radius: 12px;
  padding: 25px 30px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  max-width: 600px;
  margin: 0 auto;
}

#question {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #222;
}

.btn-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.btn {
  background-color: #3a86ff;
  border: none;
  border-radius: 10px;
  color: white;
  padding: 14px 10px;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 12px rgba(58, 134, 255, 0.5);
  user-select: none;
}

.btn:hover {
  background-color: #2657a6;
  box-shadow: 0 6px 18px rgba(38, 87, 166, 0.7);
}

.btn.correct {
  background-color: #28a745 !important;
  box-shadow: 0 6px 18px rgba(40, 167, 69, 0.7) !important;
  border: 2px solid #1e7e34;
  animation: glowGreen 1.5s ease-in-out infinite alternate;
}

@keyframes glowGreen {
  0% { box-shadow: 0 0 8px 2px #28a745; }
  100% { box-shadow: 0 0 15px 5px #28a745; }
}

.btn.wrong {
  background-color: #dc3545 !important;
  box-shadow: 0 6px 18px rgba(220, 53, 69, 0.7) !important;
  border: 2px solid #a71d2a;
}

#try-again-btn {
  margin-top: 30px;
  padding: 14px 28px;
  font-size: 20px;
  border: none;
  border-radius: 12px;
  background-color: #ff4b5c;
  color: white;
  cursor: pointer;
  display: block;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 6px 20px rgba(255, 75, 92, 0.7);
  transition: background-color 0.3s;
  user-select: none;
}

#try-again-btn:hover {
  background-color: #cc3a48;
}
