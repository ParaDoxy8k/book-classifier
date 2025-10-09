import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File | null

    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 })
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/predict`
    const backendForm = new FormData()
    backendForm.append("file", image)

    const response = await fetch(backendUrl, {
      method: "POST",
      body: backendForm,
    })

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json({ error: text }, { status: response.status })
    }

    const result = await response.json()

    // แปลงให้ตรงกับ structure ที่ frontend ใช้
    const mappedResult = {
      condition: result.prediction === "Old" ? "Poor" : "Excellent",
      confidence: result.confidence / 100,
      details: {
        coverCondition: result.prediction === "Old" ? "Worn cover" : "Clean cover",
        pageCondition: result.prediction === "Old" ? "Yellowed pages" : "Crisp pages",
        bindingCondition: result.prediction === "Old" ? "Loose binding" : "Firm binding",
      },
      recommendations:
        result.prediction === "Old"
          ? [
              "Store in a dry, cool place.",
              "Consider rebinding for preservation.",
              "Avoid direct sunlight exposure.",
            ]
          : [
              "Keep in protective sleeve.",
              "Maintain in low-humidity environment.",
              "Avoid bending or stacking heavy items.",
            ],
    }

    return NextResponse.json(mappedResult)
  } catch (err) {
    console.error("Error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
