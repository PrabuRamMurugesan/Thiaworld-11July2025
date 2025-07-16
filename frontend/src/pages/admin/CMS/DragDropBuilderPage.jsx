import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Button, Modal, Form,
} from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DragDropBuilderPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [newBlockType, setNewBlockType] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  const [blockContent, setBlockContent] = useState({});
  const [metaInfo, setMetaInfo] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const blockTypes = [
    'Hero', 'Text', 'Image', 'CTA', 'Carousel',
    'ProductGrid', 'YouTubeEmbed', 'Testimonials', 'BlogFeed',
  ];

  const handleImageUpload = (e, multiple = false) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    }));

    Promise.all(readers).then(images => {
      if (multiple) {
        setBlockContent(prev => ({ ...prev, images }));
      } else {
        setPreviewImage(images[0]);
      }
    });
  };

  const handleJSONInput = (field, value) => {
    try {
      const parsed = JSON.parse(value);
      setBlockContent(prev => ({ ...prev, [field]: parsed }));
    } catch {
      setBlockContent(prev => ({ ...prev, [field]: [] }));
    }
  };

  const addOrUpdateBlock = (e) => {
    e.preventDefault();
    const common = {
      content: {
        ...blockContent,
        ...(previewImage ? { url: previewImage } : {}),
      },
      geo: metaInfo.geo || 'Global',
      lang: metaInfo.lang || 'EN',
      visible: true,
    };

    if (editingBlock) {
      const updated = { ...editingBlock, ...common };
      setBlocks(blocks.map(b => b.id === updated.id ? updated : b));
      setEditingBlock(null);
    } else {
      const newBlock = {
        id: `block-${Date.now()}`,
        type: newBlockType,
        ...common,
      };
      setBlocks([...blocks, newBlock]);
    }

    resetModalState();
  };

  const resetModalState = () => {
    setNewBlockType(null);
    setEditingBlock(null);
    setBlockContent({});
    setMetaInfo({});
    setPreviewImage(null);
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = [...blocks];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setBlocks(reordered);
  };

  const openEditModal = (block) => {
    setEditingBlock(block);
    setBlockContent(block.content);
    setMetaInfo({ geo: block.geo, lang: block.lang });
  };

  const BlockRenderer = ({ block, onEdit, onRemove }) => (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <strong>{block.type} Block</strong>
            <div className="small text-muted">
              🌍 {block.geo} | 🌐 {block.lang} | 👁️ {block.visible ? 'Visible' : 'Hidden'}
            </div>
          </div>
          <div>
            <Button variant="outline-primary" size="sm" onClick={() => onEdit(block)}>Edit</Button>{' '}
            <Button variant="outline-danger" size="sm" onClick={() => onRemove(block.id)}>Remove</Button>
          </div>
        </div>
        <hr />
        {block.type === 'Hero' && (<><h3>{block.content.title}</h3><p>{block.content.subtitle}</p><img src={block.content.url} alt="Hero" className="img-fluid" /></>)}
        {block.type === 'Text' && <p>{block.content.text}</p>}
        {block.type === 'Image' && <><img src={block.content.url} className="img-fluid mb-2" alt={block.content.alt || ''} /><p>{block.content.caption}</p></>}
        {block.type === 'CTA' && (<div className="text-center"><h5>{block.content.message}</h5><Button>{block.content.buttonText}</Button></div>)}
        {block.type === 'Carousel' && block.content.images?.length > 0 && (
          <div className="d-flex flex-wrap">{block.content.images.map((img, i) => (
            <img key={i} src={img} className="img-fluid me-2 mb-2" style={{ maxWidth: '150px' }} alt="" />
          ))}</div>
        )}
        {block.type === 'ProductGrid' && (
          <Row>{block.content.products?.map((p, i) => (
            <Col md={4} key={i}>
              <Card><Card.Img variant="top" src={p.image} /><Card.Body><Card.Title>{p.name}</Card.Title><Card.Text>Price: {p.price}</Card.Text></Card.Body></Card>
            </Col>
          ))}</Row>
        )}
        {block.type === 'YouTubeEmbed' && block.content.url && (
          <div className="ratio ratio-16x9"><iframe src={block.content.url} title="YouTube Video" allowFullScreen></iframe></div>
        )}
        {block.type === 'Testimonials' && block.content.entries?.map((t, i) => (
          <blockquote key={i} className="blockquote"><p>“{t.quote}”</p><footer className="blockquote-footer">{t.name}</footer></blockquote>
        ))}
        {block.type === 'BlogFeed' && block.content.posts?.map((p, i) => (
          <div key={i}><h5>{p.title}</h5><p>{p.preview}</p></div>
        ))}
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={3}>
          <h5>📦 Add Block</h5>
          {blockTypes.map((type) => (
            <Card key={type} className="mb-2">
              <Card.Body>
                <Card.Title>{type} Block</Card.Title>
                <Button size="sm" onClick={() => setNewBlockType(type)}>➕ Add</Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col md={9}>
          <h5>🧱 Builder Area</h5>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <BlockRenderer block={block} onEdit={openEditModal} onRemove={removeBlock} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Col>
      </Row>

      {/* === Modal for Add/Edit === */}
      {(newBlockType || editingBlock) && (
        <Modal show onHide={resetModalState}>
          <Modal.Header closeButton>
            <Modal.Title>{editingBlock ? 'Edit' : 'Create'} {editingBlock?.type || newBlockType} Block</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={addOrUpdateBlock}>
              {(() => {
                const type = editingBlock?.type || newBlockType;
                switch (type) {
                  case 'Hero':
                    return (
                      <>
                        <Form.Group><Form.Label>Title</Form.Label><Form.Control defaultValue={blockContent.title} onChange={e => setBlockContent({ ...blockContent, title: e.target.value })} /></Form.Group>
                        <Form.Group><Form.Label>Subtitle</Form.Label><Form.Control defaultValue={blockContent.subtitle} onChange={e => setBlockContent({ ...blockContent, subtitle: e.target.value })} /></Form.Group>
                        <Form.Group><Form.Label>Background Image</Form.Label><Form.Control type="file" accept="image/*" onChange={handleImageUpload} /></Form.Group>
                        {previewImage && <img src={previewImage} className="img-fluid mt-2" alt="Preview" />}
                      </>
                    );
                  case 'Text':
                    return <Form.Group><Form.Label>Text</Form.Label><Form.Control as="textarea" rows={3} defaultValue={blockContent.text} onChange={e => setBlockContent({ ...blockContent, text: e.target.value })} /></Form.Group>;
                  case 'Image':
                    return (
                      <>
                        <Form.Group><Form.Label>Upload Image</Form.Label><Form.Control type="file" accept="image/*" onChange={handleImageUpload} /></Form.Group>
                        <Form.Group><Form.Label>Caption</Form.Label><Form.Control defaultValue={blockContent.caption} onChange={e => setBlockContent({ ...blockContent, caption: e.target.value })} /></Form.Group>
                        <Form.Group><Form.Label>Alt Text</Form.Label><Form.Control defaultValue={blockContent.alt} onChange={e => setBlockContent({ ...blockContent, alt: e.target.value })} /></Form.Group>
                        {previewImage && <img src={previewImage} className="img-fluid mt-2" alt="Preview" />}
                      </>
                    );
                  case 'CTA':
                    return (
                      <>
                        <Form.Group><Form.Label>Message</Form.Label><Form.Control defaultValue={blockContent.message} onChange={e => setBlockContent({ ...blockContent, message: e.target.value })} /></Form.Group>
                        <Form.Group><Form.Label>Button Text</Form.Label><Form.Control defaultValue={blockContent.buttonText} onChange={e => setBlockContent({ ...blockContent, buttonText: e.target.value })} /></Form.Group>
                      </>
                    );
                  case 'Carousel':
                    return (
                      <Form.Group>
                        <Form.Label>Upload Multiple Images</Form.Label>
                        <Form.Control type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, true)} />
                      </Form.Group>
                    );
                  case 'ProductGrid':
                    return (
                      <Form.Group>
                        <Form.Label>Products (JSON)</Form.Label>
                        <Form.Control as="textarea" rows={4} defaultValue={JSON.stringify(blockContent.products || [], null, 2)} onChange={(e) => handleJSONInput('products', e.target.value)} />
                      </Form.Group>
                    );
                  case 'YouTubeEmbed':
                    return (
                      <Form.Group>
                        <Form.Label>YouTube URL</Form.Label>
                        <Form.Control defaultValue={blockContent.url} onChange={e => setBlockContent({ ...blockContent, url: e.target.value })} />
                      </Form.Group>
                    );
                  case 'Testimonials':
                    return (
                      <Form.Group>
                        <Form.Label>Testimonials (JSON)</Form.Label>
                        <Form.Control as="textarea" rows={4} defaultValue={JSON.stringify(blockContent.entries || [], null, 2)} onChange={(e) => handleJSONInput('entries', e.target.value)} />
                      </Form.Group>
                    );
                  case 'BlogFeed':
                    return (
                      <Form.Group>
                        <Form.Label>Blog Posts (JSON)</Form.Label>
                        <Form.Control as="textarea" rows={4} defaultValue={JSON.stringify(blockContent.posts || [], null, 2)} onChange={(e) => handleJSONInput('posts', e.target.value)} />
                      </Form.Group>
                    );
                  default: return null;
                }
              })()}

              <hr />
              <Form.Group><Form.Label>🌍 Geo</Form.Label><Form.Control defaultValue={metaInfo.geo} onChange={e => setMetaInfo({ ...metaInfo, geo: e.target.value })} /></Form.Group>
              <Form.Group><Form.Label>🌐 Language</Form.Label><Form.Control defaultValue={metaInfo.lang} onChange={e => setMetaInfo({ ...metaInfo, lang: e.target.value })} /></Form.Group>
              <Button type="submit" className="mt-3" variant="success">{editingBlock ? '💾 Save Changes' : '✅ Add Block'}</Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default DragDropBuilderPage;
