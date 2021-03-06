DO $$DECLARE organizer1 uuid;
  organizer2 uuid;
  organizer3 uuid;
  category1 uuid;
  category2 uuid;
  category3 uuid;
BEGIN
INSERT INTO event.event_organizer (
      name,
      identification,
      type,
      email,
      phone,
      image_url,
      web_url,
      country,
      addressLine1,
      addressLine2,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      'Organizer1', 
      '112434555', 
      'company', 
      'andres+organizer1@gmail.com', 
      '283043033',
      'google.com',
      'google.com',
      'CRC',
      'Line1',
      'Line2',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      )
RETURNING id INTO organizer1;

INSERT INTO event.event_organizer (
      name,
      identification,
      type,
      email,
      phone,
      image_url,
      web_url,
      country,
      addressLine1,
      addressLine2,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      'Organizer2', 
      '112434552', 
      'company', 
      'andres+organizer2@gmail.com', 
      '283043032',
      'google.com',
      'google.com',
      'CRC',
      'Line1',
      'Line2',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      ) RETURNING id INTO organizer2;


INSERT INTO event.event_organizer (
      name,
      identification,
      type,
      email,
      phone,
      image_url,
      web_url,
      country,
      addressLine1,
      addressLine2,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      'Organizer3', 
      '112434553', 
      'company', 
      'andres+organizer3@gmail.com', 
      '283043031',
      'google.com',
      'google.com',
      'CRC',
      'Line1',
      'Line2',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      ) RETURNING id INTO organizer3;

  INSERT INTO event.event_category (
      name,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      'Category1', 
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      ) RETURNING id INTO category1;

INSERT INTO event.event_category (
      name,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      'Category2', 
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      ) RETURNING id INTO category2;

  INSERT INTO event.event_category (
      name,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      'Category3', 
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      ) RETURNING id INTO category3;
  
  INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category1, 
      organizer1, 
      'Event1', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
   
   INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category2, 
      organizer1, 
      'Event2', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );

     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category3, 
      organizer1, 
      'Event3', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category1, 
      organizer1, 
      'Concierto', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category2, 
      organizer1, 
      'Concierto2', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category2, 
      organizer3, 
      'Concierto3', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category3, 
      organizer1, 
      'Futbol', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category3, 
      organizer2, 
      'Futbol2', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category2, 
      organizer3, 
      'Futbol3', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category1, 
      organizer1, 
      'Rock', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category1, 
      organizer1, 
      'Rock2', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category1, 
      organizer3, 
      'Rock3', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category2, 
      organizer2, 
      'Musical', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category2, 
      organizer1, 
      'Musical2', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category2, 
      organizer3, 
      'Musical3', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category1, 
      organizer3, 
      'Filarmonica', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category1, 
      organizer2, 
      'Filarmonica2', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category1, 
      organizer1, 
      'Filarmonica4', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category3, 
      organizer2, 
      'Basquet', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category3, 
      organizer1, 
      'Basquet2', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category1, 
      organizer1, 
      'Basquet3', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category2, 
      organizer2, 
      'Nascar', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category2, 
      organizer3, 
      'Nascar2', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
     INSERT INTO event.event (
      event_category_id,
      event_organizer_id,
      name,
      tags,
      web_url,
      cover_image_url,
      start_date,
      end_date,
      status,
      country,
      address_line1,
      address_line2,
      latitude,
      longitude,
      updated_by,
      created_by,
      created_at,
      updated_at) 
  VALUES(
      category2, 
      organizer1, 
      'Nascar45', 
      '{}', 
      'google.com',
      'https://ep01.epimg.net/verne/imagenes/2015/10/18/articulo/1445171361_981733_1445201957_noticia_normal.jpg',
      date('now') + interval '1 year',
      date('now') + interval '2 year',
      'On going',
      'CRC',
      'line1',
      'line2',
      '38.898556',
      '-77.037852',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      'e1554cf3-bb58-4bce-b0b3-40d00b24ad69',
      NOW(),
      NOW()
      );
END$$;
