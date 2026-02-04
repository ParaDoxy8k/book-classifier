# 📚 Book Classifier (AI Project)

โปรเจกต์นี้เป็นเว็บแอปที่ใช้ Machine Learning (หรือ NLP) ในการทำนายว่า
หนังสือที่ได้รับเข้ามาเป็น **หนังสือเก่า** หรือ **หนังสือใหม่**

## 🚀 เป้าหมาย
- เทรนโมเดลเพื่อจำแนกหนังสือเก่า/ใหม่จากข้อมูล input เช่น text/metadata
- แสดงผลลัพธ์ผ่านเว็บ UI
- ใช้ Next.js + (ML backend) + API

## 🧠 วิธีทำงาน
1. รับข้อมูลหนังสือ (title, description, ISBN, ปีตีพิมพ์ ฯลฯ)
2. preprocess ข้อมูล text
3. transform เป็น vector (TF-IDF / embeddings)
4. train classifier เช่น Logistic Regression, SVM หรือ Transformer
5. ส่งผลลัพธ์ผ่าน API ไปแสดงบนเว็บ

## 📦 โครงสร้างโปรเจกต์
📦 app/
📦 components/
📦 lib/
📦 public/
├─ package.json
├─ next.config.ts
├─ tsconfig.json

## 🛠 การติดตั้ง
bun install
bun run dev

## 📚 Dataset
อธิบาย dataset ที่ใช้ train model
-หาข้อมูลรูปภาพเองจำนวน 400 รูป
