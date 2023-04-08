const Document = require('../models/documentModel')
const { generateDocument, mergeDocuments } = require('../utils/fileHandler')

exports.createDocument = async (req, res) => {
  try {
    const documentData = req.body
    const userId = req.user._id

    const generatedFiles = await generateDocument(documentData, userId)
    const mergedFile = await mergeDocuments(generatedFiles)

    const newDocument = new Document({
      user: userId,
      title: documentData.title,
      caseType: documentData.caseType,
      file: mergedFile,
      instructions: generatedFiles.instructions
    })

    const savedDocument = await newDocument.save()

    res.status(201).json({
      status: 'success',
      data: {
        document: savedDocument
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    })
  }
}

exports.getDocumentsByUser = async (req, res) => {
  try {
    const userId = req.user._id

    const documents = await Document.find({ user: userId })

    res.status(200).json({
      status: 'success',
      data: {
        documents
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    })
  }
}
